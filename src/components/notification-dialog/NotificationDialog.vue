<template>
    <div class="notification">
        <div class="title">
            <el-icon @click="closeDrawer" class="back-btn" size="24px" color="#71B6FF">
                <ArrowLeft />
            </el-icon>
            <div class="message">
                消息
                <div
                    v-if="props.answerCount + props.questionCount + props.replyCount > 0"
                    class="count"
                >
                    {{ props.answerCount + props.questionCount + props.replyCount }}
                </div>
            </div>
        </div>
        <div class="notification-tabs">
            <div
                class="notification-tab"
                :class="{ active: radio == NotificationType.QUESTION }"
                @click="switchTab(NotificationType.QUESTION)"
                v-if="userStore.getRole() == 'teacher'"
            >
                提问我的
                <div v-if="props.questionCount > 0" class="badge">
                    {{ props.questionCount }}
                </div>
            </div>
            <div
                class="notification-tab"
                :class="{ active: radio === NotificationType.ANSWER }"
                @click="switchTab(NotificationType.ANSWER)"
            >
                回答我的
                <div v-if="props.answerCount > 0" class="badge">
                    {{ props.answerCount }}
                </div>
            </div>
            <div
                class="notification-tab"
                :class="{ active: radio === NotificationType.REPLY }"
                @click="switchTab(NotificationType.REPLY)"
            >
                回复我的
                <div v-if="props.replyCount > 0" class="badge">{{ props.replyCount }}</div>
            </div>
        </div>
        <el-scrollbar>
            <Transition :name="animationName" mode="out-in">
                <div class="notification-container" :key="radio">
                    <div
                        v-if="
                            radio == NotificationType.QUESTION && userStore.getRole() == 'teacher'
                        "
                    >
                        <div v-for="item in newQuestion" :key="item.id" class="notification-item">
                            <NotificationCard
                                type="question"
                                :created_at="item.created_at"
                                :id="item.id"
                                :is_read="item.is_read"
                                :question_id="item.question_id"
                                :question_title="item.question_title"
                                :question_content="item.question_content"
                                :user_avatar="item.user_avatar"
                                :user_name="item.user_name"
                                :user_id="item.user_id"
                                @reply="closeDrawer"
                                @open-delete-dialog="openDeleteDialog"
                            />
                        </div>
                        <div v-if="newQuestion.length == 0" class="empty-state">
                            <div class="empty-icon">
                                <el-icon :size="48">
                                    <Notification />
                                </el-icon>
                            </div>
                            <div class="empty-text">暂无提问通知</div>
                        </div>
                    </div>
                    <div v-else-if="radio == NotificationType.ANSWER">
                        <div v-for="item in newAnswer" :key="item.id" class="notification-item">
                            <NotificationCard
                                type="answer"
                                :created_at="item.created_at"
                                :id="item.id"
                                :is_read="item.is_read"
                                :question_id="item.question_id"
                                :question_title="item.question_title"
                                :question_content="item.question_content"
                                :answer_id="item.answer_id"
                                :answer_content="item.answer_content"
                                :respondent_avatar="item.respondent_avatar"
                                :respondent_name="item.respondent_name"
                                :respondent_id="item.respondent_id"
                                @reply="closeDrawer"
                                @open-delete-dialog="openDeleteDialog"
                            />
                        </div>
                        <div v-if="newAnswer.length == 0" class="empty-state">
                            <div class="empty-icon">
                                <el-icon :size="48">
                                    <ChatLineRound />
                                </el-icon>
                            </div>
                            <div class="empty-text">暂无回答通知</div>
                        </div>
                    </div>
                    <div v-else-if="radio == NotificationType.REPLY">
                        <div v-for="item in newReply" :key="item.id" class="notification-item">
                            <NotificationCard
                                type="reply"
                                :created_at="item.created_at"
                                :id="item.id"
                                :is_read="item.is_read"
                                :question_id="item.question_id"
                                :question_title="item.question_title"
                                :question_content="item.question_content"
                                :answer_id="item.answer_id"
                                :answer_content="item.answer_content"
                                :respondent_avatar="item.respondent_avatar"
                                :respondent_name="item.respondent_name"
                                :respondent_id="item.respondent_id"
                                :reply_id="item.reply_id"
                                :reply_content="item.reply_content"
                                @reply="closeDrawer"
                                @open-delete-dialog="openDeleteDialog"
                            />
                        </div>
                        <div v-if="newReply.length == 0" class="empty-state">
                            <div class="empty-icon">
                                <el-icon :size="48">
                                    <ChatDotRound />
                                </el-icon>
                            </div>
                            <div class="empty-text">暂无回复通知</div>
                        </div>
                    </div>
                </div>
            </Transition>
        </el-scrollbar>
    </div>
    <el-dialog
        v-model="deleteDialogVisible"
        width="300px"
        :show-close="false"
        align-center
        class="delete-dialog"
        style="border-radius: 20px"
    >
        <template #header>
            <div class="dialog-header">
                <el-icon size="22" color="#f56c6c"><WarningFilled /></el-icon>
                <span>删除通知</span>
            </div>
        </template>
        <p class="dialog-content">确定要删除这条通知吗？此操作不可撤销。</p>
        <div class="dialog-footer">
            <el-button @click="cancelDelete" plain size="small">取消</el-button>
            <el-button @click="deleteNotification" type="danger" size="small">
                <template #icon
                    ><el-icon><Delete /></el-icon
                ></template>
                删除
            </el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { deleteNotificationApi, getNotificationApi } from '@/api/notification/notification.api'
import type { NewQuestion, NewAnswer, NewReply } from '@/model/notification.model'
import { NotificationCard } from '@/components/notification-dialog'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UserStore } from '@/store/modules/user'

// 导入全局事件总线
import { emitter } from '@/utils/emitter'

const deleteDialogVisible = ref(false)

const userStore = UserStore()

const deleteMessage = ref<deleteMessage>({
    id: 0,
    type: '',
})

interface deleteMessage {
    id: number
    type: string
}

function openDeleteDialog(_deleteMessage: deleteMessage) {
    deleteDialogVisible.value = true
    deleteMessage.value = _deleteMessage
}

async function deleteNotification() {
    console.log('delete')
    deleteDialogVisible.value = false
    console.log(deleteMessage.value)

    await deleteNotificationApi(deleteMessage.value.id).then((res) => {
        if (res != null) {
            ElMessage.success('删除成功')
        }
    })

    if (deleteMessage.value.type == NotificationType.QUESTION) {
        newQuestion.value = newQuestion.value.filter((item) => item.id !== deleteMessage.value.id)
    } else if (deleteMessage.value.type == NotificationType.ANSWER) {
        newAnswer.value = newAnswer.value.filter((item) => item.id !== deleteMessage.value.id)
    } else if (deleteMessage.value.type == NotificationType.REPLY) {
        newReply.value = newReply.value.filter((item) => item.id !== deleteMessage.value.id)
    }
}

function cancelDelete() {
    deleteDialogVisible.value = false
}

enum NotificationType {
    QUESTION = 'question',
    ANSWER = 'answer',
    REPLY = 'reply',
}

const props = defineProps<{
    questionCount: number
    answerCount: number
    replyCount: number
    user_id: number
}>()

const radio = ref(NotificationType.ANSWER)
const prevRadio = ref(NotificationType.ANSWER)
const animationName = ref('fade-right')

const NotificationTabList = computed(() => {
    if (userStore.getRole() === 'teacher') {
        return [NotificationType.QUESTION, NotificationType.ANSWER, NotificationType.REPLY]
    } else {
        return [NotificationType.ANSWER, NotificationType.REPLY]
    }
})

function switchTab(tabType: NotificationType) {
    if (tabType === radio.value) return
    if (
        NotificationTabList.value.indexOf(tabType) < NotificationTabList.value.indexOf(radio.value)
    ) {
        animationName.value = 'fade-left'
    } else {
        animationName.value = 'fade-right'
    }

    prevRadio.value = radio.value
    radio.value = tabType
}

const emit = defineEmits(['closeDrawer'])

function closeDrawer() {
    emit('closeDrawer')
}

const newQuestion = ref<NewQuestion[]>([])
const newAnswer = ref<NewAnswer[]>([])
const newReply = ref<NewReply[]>([])

async function loadNotification() {
    await getNotificationApi(props.user_id)
        .then((res) => {
            newQuestion.value = res.new_question
            newAnswer.value = res.new_answer
            newReply.value = res.new_reply
        })
        .catch((err) => {
            console.log(err)
        })
}

onMounted(async () => {
    await loadNotification()

    // 监听问题详情页打开事件
    emitter.on('questionDetailOpened', handleQuestionDetailOpened)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
    emitter.off('questionDetailOpened', handleQuestionDetailOpened)
})

// 定义事件处理函数
const handleQuestionDetailOpened = async (data: { questionId: number }) => {
    // 直接在前端更新相关通知的状态为已读
    // 更新提问通知
    newQuestion.value = newQuestion.value.map((item) => {
        if (item.question_id === data.questionId) {
            return { ...item, is_read: true }
        }
        return item
    })

    // 更新回答通知
    newAnswer.value = newAnswer.value.map((item) => {
        if (item.question_id === data.questionId) {
            return { ...item, is_read: true }
        }
        return item
    })

    // 更新回复通知
    newReply.value = newReply.value.map((item) => {
        if (item.question_id === data.questionId) {
            return { ...item, is_read: true }
        }
        return item
    })
}
</script>

<style scoped lang="scss">
.notification {
    display: flex;
    height: 100%;
    flex-direction: column;
    background-color: $su-bg-grey;

    .title {
        display: flex;
        align-items: center;
        padding: 15px 15px 10px;

        .back-btn {
            cursor: pointer;
            padding: 8px;
            margin-right: 8px;
            border-radius: 50%;
            background-color: rgba(113, 182, 255, 0.1);
            transition: all 0.3s ease;

            &:hover {
                background-color: rgba(113, 182, 255, 0.2);
                transform: translateX(-3px);
            }
        }

        .message {
            position: relative;
            padding-right: 15px;
            font-size: 20px;
            font-weight: 600;
            color: #303133;

            .count {
                position: absolute;
                top: -2px;
                right: 0;
                min-width: 16px;
                height: 16px;
                padding: 0 5px;
                font-size: 12px;
                font-weight: bold;
                color: white;
                border-radius: 8px;
                background-color: $su-red;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(255, 77, 79, 0.4);
            }
        }
    }

    .notification-tabs {
        display: flex;
        border-bottom: 1px solid $su-border;
        margin: 0px 15px 15px;
        background-color: white;
        border-radius: 12px;
        padding: 5px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

        .notification-tab {
            position: relative;
            flex: 1;
            text-align: center;
            padding: 12px 5px;
            cursor: pointer;
            font-size: 14px;
            color: #606266;
            transition: all 0.3s ease;
            border-radius: 8px;

            &:hover {
                color: $su-blue;
                background-color: rgba(113, 182, 255, 0.05);
            }

            &.active {
                color: $su-blue;
                font-weight: bold;
                background-color: rgba(113, 182, 255, 0.1);
            }

            .badge {
                position: absolute;
                top: 6px;
                right: 15%;
                min-width: 16px;
                height: 16px;
                padding: 0 4px;
                font-size: 10px;
                color: white;
                border-radius: 8px;
                background-color: $su-red;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    .notification-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        padding-bottom: 10%;
        width: 100%; /* 确保宽度100%以便应用动画 */

        .notification-item {
            margin-bottom: 10px;
            transition: all 0.3s ease;
            padding: 0 15px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
            color: #909399;

            .empty-icon {
                margin-bottom: 15px;
                color: #c0c4cc;

                .el-icon {
                    opacity: 0.6;
                }
            }

            .empty-text {
                font-size: 14px;
            }
        }
    }
}

.delete-dialog {
    .dialog-header {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #f56c6c;
        font-weight: 600;
        padding: 15px 0 0;
    }

    .dialog-content {
        margin: 15px 0;
        color: #606266;
        font-size: 14px;
        line-height: 1.5;
    }

    .dialog-footer {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 20px;
    }
}

/* 从右侧滑入滑出的动画 */
.fade-right-enter-active,
.fade-right-leave-active {
    transition: all 0.3s ease;
}

.fade-right-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.fade-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* 从左侧滑入滑出的动画 */
.fade-left-enter-active,
.fade-left-leave-active {
    transition: all 0.3s ease;
}

.fade-left-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
