<template>
    <div class="main" :style="props.is_read ? 'opacity: 0.5' : ''">
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
                <div class="line" />
                <div class="reply-to-content-text">
                    <span class="name">{{ userName }}:</span>
                    <span class="content">{{ reply_content }}</span>
                </div>

            </div>
        </div>
        <div class="footer">
            <span class="time">{{ getTimeStr(created_at) }}</span>
            <div @click.stop="clickReply" class="reply-btn">
                <span class="text">回复</span>
                <el-icon size="13">
                    <ChatRound />
                </el-icon>
            </div>
            <div @click.stop="clickDelete" class="delete-btn">
                <span>删除</span>
                <el-icon size="13">
                    <Delete />
                </el-icon>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" width="20%" :show-close="false" align-center>
            <template #header>
                <p style="margin: 0;">删除</p>
            </template>
            <p>确定删除这条通知吗？</p>
            <div class="dialog">
                <el-button @click="deleteNotification" type="danger" round size="small">删除</el-button>
                <el-button @click="cancelDelete" type="default" round size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script setup lang='ts'>
import { deleteNotificationApi, readNotificationApi } from '@/api/notification/notification.api';
import { router } from '@/router';
import { getTimeStr } from '@/utils/time';
import { getUserInfo } from '@/utils/userInfo';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

enum NotificationType {
    QUESTION = 'question',
    ANSWER = 'answer',
    REPLY = 'reply'
}

interface NotificationCardProps {
    type: string;
    id: number; // 提醒id
    question_id: number; // 问题id
    question_title: string; // 问题标题
    question_content: string; // 问题内容
    is_read: boolean; // 是否已读
    created_at: number; // 创建时间
    user_avatar?: string; // 提问者头像
    user_name?: string; // 提问者昵称
    user_id?: number; // 提问者id
    answer_id?: number; // 回答id
    answer_content?: string; // 回答内容
    respondent_avatar?: string; // 回复者头像
    respondent_name?: string; // 回复者昵称
    respondent_id?: number; // 回复者id
    reply_id?: number; // 回复id
    reply_content?: string; // 回复内容

}
const props = defineProps<NotificationCardProps>();
const userName = getUserInfo().nickname;

const emit = defineEmits(['reply', 'delete', 'read']);

async function clickReply() {
    emit('reply');
    let path = '';
    if (props.type == NotificationType.QUESTION) {
        path = `/question-detail/${props.question_id}`;
    } else if (props.type == NotificationType.ANSWER) {
        path = `/question-detail/${props.question_id}#${props.answer_id}`;
    } else if (props.type == NotificationType.REPLY) {
        path = `/question-detail/${props.question_id}#${props.answer_id}`;
    }
    await readNotificationApi(props.id).then((res) => {
        if (res != null) {
            emit('read', props.id, props.type, res.is_read);
        }
    });
    router.push(path).then(() => {
        router.go(0)
    })
}

function clickDelete() {
    dialogVisible.value = true;
}

async function deleteNotification() {
    console.log('delete');
    dialogVisible.value = false;
    await deleteNotificationApi(props.id).then((res) => {
        if (res != null) {
            ElMessage.success('删除成功');
            emit('delete', props.id, props.type);
        }
    });

}

function cancelDelete() {
    dialogVisible.value = false;
}

const dialogVisible = ref(false);
</script>

<style scoped lang="scss">
.main {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    border-top: 1px solid $su-border;
    border-bottom: 1px solid $su-border;

    .header {
        display: flex;
        margin-bottom: 10px;
        line-height: 16px;

        .name {
            font-size: 16px;
            font-weight: bold;
            margin-right: 10px;
        }

        .topic {
            font-size: 14px;
            line-height: 16px;
            color: $su-grey;
        }
    }

    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 16px;

        .time {
            font-size: 12px;
            line-height: 16px;
            color: $su-grey;

        }

        .reply-btn {
            display: flex;
            align-items: center;
            font-size: 12px;
            line-height: 16px;
            color: $su-grey;
            margin-left: 10px;

            .el-icon {
                vertical-align: sub;
                margin-left: 5px;
            }
        }

        .delete-btn {
            display: flex;
            align-items: center;
            font-size: 12px;
            line-height: 16px;
            color: $su-grey;
            margin-left: 10px;

            .el-icon {
                vertical-align: sub;
                margin-left: 5px;
            }
        }

        .reply-btn:hover {
            cursor: pointer;
            color: $su-blue;
        }

        .delete-btn:hover {
            cursor: pointer;
            color: $su-red;
        }
    }

    .question {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;


        .question-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .question-content {
            font-size: 14px;
            line-height: 16px;
            color: $su-grey;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .answer {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;

        .answer-content {
            font-size: 14px;
            line-height: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .reply {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;

        .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 16px;
            margin-bottom: 10px;
            overflow: hidden;

            .text {
                margin-right: 5px;
                flex-shrink: 0;
            }

            .name {
                color: $su-blue;
                margin-right: 5px;
                flex-shrink: 0;
            }

            .content {
                color: $su-grey;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex-grow: 1;
            }
        }

        .reply-to-content {
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            overflow: hidden;
            height: 16px;

            .line {
                width: 3px;
                height: 100%;
                background-color: $su-grey-light;
                border-radius: 3px;
                margin-bottom: 5px;
                margin-right: 5px;
                flex-shrink: 0;
            }

            .reply-to-content-text {
                display: flex;
                font-size: 14px;
                line-height: 16px;
                overflow: hidden;
                color: $su-grey;

                .name {
                    margin-right: 5px;
                    flex-shrink: 0;
                }

                .content {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex-grow: 1;
                }
            }
        }
    }

    .dialog {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
}



:deep(.el-dialog) {
    border-radius: 20px;
}

:deep(.el-dialog__header) {
    padding: 0;
}
</style>