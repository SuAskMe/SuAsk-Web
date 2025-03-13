<template>
    <div class="notification-card" :class="{ 'is-read': props.is_read }">
        <div class="card-inner">
            <div v-if="!props.is_read" class="unread-marker"></div>

            <div class="header" v-if="props.type == NotificationType.QUESTION">
                <span class="name">{{ user_name }}</span>
                <span class="topic">提出了一个问题</span>
            </div>
            <div class="question" v-if="props.type == NotificationType.QUESTION">
                <span class="question-title">{{ question_title }}</span>
                <span class="question-content">{{ question_content }}</span>
            </div>

            <div class="header" v-if="props.type == NotificationType.ANSWER">
                <span class="name">{{ respondent_name }}</span>
                <span class="topic">对我的问题发表了回答</span>
            </div>
            <div class="answer" v-if="props.type == NotificationType.ANSWER">
                <span class="answer-content">{{ answer_content }}</span>
            </div>

            <div class="header" v-if="props.type == NotificationType.REPLY">
                <span class="name">{{ respondent_name }}</span>
                <span class="topic">回复了我的回答</span>
            </div>
            <div class="reply" v-if="props.type == NotificationType.REPLY">
                <div class="reply-content">
                    <span class="text">回复</span>
                    <span class="name">@{{ userName }}</span>
                    <span class="content">: {{ answer_content }}</span>
                </div>
                <div class="reply-to-content">
                    <div class="line"></div>
                    <div class="reply-to-content-text">
                        <span class="name">{{ userName }}:</span>
                        <span class="content">{{ reply_content }}</span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <span class="time">{{ getTimeStr(created_at) }}</span>
                <div class="actions">
                    <div @click.stop="clickReply" class="action-btn reply-btn">
                        <el-icon size="14">
                            <ChatRound />
                        </el-icon>
                        <span class="text">回复</span>
                    </div>
                    <div @click.stop="clickDelete" class="action-btn delete-btn">
                        <el-icon size="14">
                            <Delete />
                        </el-icon>
                        <span class="text">删除</span>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
            v-model="dialogVisible"
            width="300px"
            :show-close="false"
            align-center
            class="delete-dialog"
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
    </div>
</template>

<script setup lang="ts">
import { deleteNotificationApi, readNotificationApi } from '@/api/notification/notification.api'
import { UserStore } from '@/store/modules/user'
import { getTimeStr } from '@/utils/time'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

enum NotificationType {
    QUESTION = 'question',
    ANSWER = 'answer',
    REPLY = 'reply',
}

interface NotificationCardProps {
    type: string
    id: number // 提醒id
    question_id: number // 问题id
    question_title: string // 问题标题
    question_content: string // 问题内容
    is_read: boolean // 是否已读
    created_at: number // 创建时间
    user_avatar?: string // 提问者头像
    user_name?: string // 提问者昵称
    user_id?: number // 提问者id
    answer_id?: number // 回答id
    answer_content?: string // 回答内容
    respondent_avatar?: string // 回复者头像
    respondent_name?: string // 回复者昵称
    respondent_id?: number // 回复者id
    reply_id?: number // 回复id
    reply_content?: string // 回复内容
}
const props = defineProps<NotificationCardProps>()

const userStore = UserStore()

const userName = userStore.getUser().name

const emit = defineEmits(['reply', 'delete', 'read'])

const router = useRouter()

async function clickReply() {
    emit('reply')
    let path = ''
    if (props.type == NotificationType.QUESTION) {
        path = `/question-detail/${props.question_id}`
    } else if (props.type == NotificationType.ANSWER) {
        path = `/question-detail/${props.question_id}#${props.answer_id}`
    } else if (props.type == NotificationType.REPLY) {
        path = `/question-detail/${props.question_id}#${props.answer_id}`
    }
    await readNotificationApi(props.id).then((res) => {
        if (res != null) {
            emit('read', props.id, props.type, res.is_read)
        }
    })
    router.push(path)
}

function clickDelete() {
    dialogVisible.value = true
}

async function deleteNotification() {
    console.log('delete')
    dialogVisible.value = false
    await deleteNotificationApi(props.id).then((res) => {
        if (res != null) {
            ElMessage.success('删除成功')
            emit('delete', props.id, props.type)
        }
    })
}

function cancelDelete() {
    dialogVisible.value = false
}

const dialogVisible = ref(false)
</script>

<style scoped lang="scss">
.notification-card {
    width: 100%;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    &.is-read {
        opacity: 0.75;
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);

        &:hover {
            opacity: 1;
        }
    }

    .card-inner {
        position: relative;
        padding: 15px;
    }

    .unread-marker {
        position: absolute;
        top: 15px;
        left: -15px;
        width: 4px;
        height: 18px;
        background-color: $su-blue;
        border-radius: 0 2px 2px 0;
    }

    .header {
        display: flex;
        margin-bottom: 10px;
        line-height: 20px;

        .name {
            font-size: 15px;
            font-weight: 600;
            margin-right: 8px;
            color: $su-blue;
        }

        .topic {
            font-size: 14px;
            color: $su-grey;
            display: flex;
            align-items: center;
        }
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;

        .time {
            font-size: 12px;
            color: #909399;
        }

        .actions {
            display: flex;
            gap: 12px;

            .action-btn {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: #909399;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
                cursor: pointer;

                .text {
                    margin-left: 4px;
                }

                &:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                &.reply-btn:hover {
                    color: $su-blue;
                }

                &.delete-btn:hover {
                    color: $su-red;
                }
            }
        }
    }

    .question {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.02);
        padding: 10px;
        border-radius: 6px;
        border-left: 3px solid rgba(113, 182, 255, 0.5);

        .question-title {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #303133;
        }

        .question-content {
            font-size: 13px;
            line-height: 1.5;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .answer {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.02);
        padding: 10px;
        border-radius: 6px;
        border-left: 3px solid rgba(103, 194, 58, 0.5);

        .answer-content {
            font-size: 14px;
            line-height: 1.5;
            color: #303133;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }

    .reply {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.02);
        padding: 10px;
        border-radius: 6px;
        border-left: 3px solid rgba(230, 162, 60, 0.5);

        .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 8px;
            overflow: hidden;

            .text {
                margin-right: 5px;
                flex-shrink: 0;
            }

            .name {
                color: $su-blue;
                margin-right: 5px;
                flex-shrink: 0;
                font-weight: 500;
            }

            .content {
                color: #303133;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex-grow: 1;
            }
        }

        .reply-to-content {
            display: flex;
            flex-direction: row;
            overflow: hidden;

            .line {
                width: 3px;
                height: auto;
                background-color: #e0e0e0;
                border-radius: 3px;
                margin-right: 8px;
                flex-shrink: 0;
            }

            .reply-to-content-text {
                display: flex;
                font-size: 13px;
                line-height: 1.5;
                overflow: hidden;
                color: #606266;

                .name {
                    margin-right: 5px;
                    flex-shrink: 0;
                    font-weight: 500;
                }

                .content {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    flex-grow: 1;
                }
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
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }
}

:deep(.el-dialog) {
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

    .el-dialog__header {
        margin: 0;
        padding: 0;
    }

    .el-dialog__body {
        padding: 15px 20px;
    }
}
</style>
