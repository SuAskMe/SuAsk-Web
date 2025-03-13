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
                @click="radio = NotificationType.QUESTION"
            >
                提问我的
                <div v-if="props.questionCount > 0" class="badge">{{ props.questionCount }}</div>
            </div>
            <div
                class="notification-tab"
                :class="{ active: radio === NotificationType.ANSWER }"
                @click="radio = NotificationType.ANSWER"
            >
                回答我的
                <div v-if="props.answerCount > 0" class="badge">{{ props.answerCount }}</div>
            </div>
            <div
                class="notification-tab"
                :class="{ active: radio === NotificationType.REPLY }"
                @click="radio = NotificationType.REPLY"
            >
                回复我的
                <div v-if="props.replyCount > 0" class="badge">{{ props.replyCount }}</div>
            </div>
        </div>
        <div class="notification-container">
            <el-scrollbar>
                <div v-if="radio == NotificationType.QUESTION">
                    <transition-group name="notification" tag="div" class="notification-list">
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
                                @delete="deleteNotification"
                                @read="readNotification"
                            />
                        </div>
                    </transition-group>
                    <div v-if="newQuestion.length == 0" class="empty-state">
                        <div class="empty-icon">
                            <el-icon :size="48">
                                <Notification />
                            </el-icon>
                        </div>
                        <div class="empty-text">暂无提问通知</div>
                    </div>
                </div>
                <div v-if="radio == NotificationType.ANSWER">
                    <transition-group name="notification" tag="div" class="notification-list">
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
                                @delete="deleteNotification"
                                @read="readNotification"
                            />
                        </div>
                    </transition-group>
                    <div v-if="newAnswer.length == 0" class="empty-state">
                        <div class="empty-icon">
                            <el-icon :size="48">
                                <ChatLineRound />
                            </el-icon>
                        </div>
                        <div class="empty-text">暂无回答通知</div>
                    </div>
                </div>
                <div v-if="radio == NotificationType.REPLY">
                    <transition-group name="notification" tag="div" class="notification-list">
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
                                @delete="deleteNotification"
                                @read="readNotification"
                            />
                        </div>
                    </transition-group>
                    <div v-if="newReply.length == 0" class="empty-state">
                        <div class="empty-icon">
                            <el-icon :size="48">
                                <ChatDotRound />
                            </el-icon>
                        </div>
                        <div class="empty-text">暂无回复通知</div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getNotificationApi } from '@/api/notification/notification.api'
import type { NewQuestion, NewAnswer, NewReply } from '@/model/notification.model'
import { NotificationCard } from '@/components/notification-card'
import { onMounted, ref } from 'vue'

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

const radio = ref(NotificationType.QUESTION)

const emit = defineEmits(['closeDrawer'])

function closeDrawer() {
    emit('closeDrawer')
}

function deleteNotification(id: number, type: string) {
    // console.log(id, type);
    if (type == NotificationType.QUESTION) {
        newQuestion.value = newQuestion.value.filter((item) => item.id !== id)
    } else if (type == NotificationType.ANSWER) {
        newAnswer.value = newAnswer.value.filter((item) => item.id !== id)
    } else if (type == NotificationType.REPLY) {
        newReply.value = newReply.value.filter((item) => item.id !== id)
    }
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

function readNotification(id: number, type: string, is_read: boolean) {
    // console.log(id, type, is_read);
}

onMounted(async () => {
    await loadNotification()
    // console.log(newReply.value);
})
</script>

<style scoped lang="scss">
.notification {
    display: flex;
    height: 100%;
    flex-direction: column;
    background-color: #f9fafc;

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
        padding: 0 15px;

        .notification-list {
            padding: 5px 0;

            .notification-item {
                margin-bottom: 10px;
                transition: all 0.3s ease;

                &:last-child {
                    margin-bottom: 0;
                }
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

// 添加过渡动画
.notification-enter-active,
.notification-leave-active {
    transition: all 0.4s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.notification-move {
    transition: transform 0.5s ease;
}
</style>
