<template>
    <div class="notification">
        <div class="title">消息</div>
        <div class="choose-notification">
            <el-radio-group v-model="radio" style="width: 100%;">
                <el-radio-button label="提问我的" value="new-question" />
                <el-radio-button label="回答我的" value="new-answer" />
                <el-radio-button label="回复我的" value="new-reply" />
            </el-radio-group>
        </div>
        <div class="notification-container">
            <el-scrollbar>
                <div v-if="radio == 'new-question'">
                    <transition-group name="notification">
                        <div v-for="item in newQuestion" :key="item.id">
                            <NotificationCard type="question" :created_at="item.created_at" :id="item.id"
                                :is_read="item.is_read" :question_id="item.question_id"
                                :question_title="item.question_title" :question_content="item.question_content"
                                :user_avatar="item.user_avatar" :user_name="item.user_name" :user_id="item.user_id"
                                @reply="closeDrawer" @delete="deleteNotification" @read="readNotification" />
                        </div>
                    </transition-group>
                    <div v-if="newQuestion.length == 0" class="text">暂无提问</div>
                </div>
                <div v-if="radio == 'new-answer'">
                    <transition-group name="notification">
                        <div v-for="item in newAnswer" :key="item.id">
                            <NotificationCard type="answer" :created_at="item.created_at" :id="item.id"
                                :is_read="item.is_read" :question_id="item.question_id"
                                :question_title="item.question_title" :question_content="item.question_content"
                                :answer_id="item.answer_id" :answer_content="item.answer_content"
                                :respondent_avatar="item.respondent_avatar" :respondent_name="item.respondent_name"
                                :respondent_id="item.respondent_id" @reply="closeDrawer" @delete="deleteNotification"
                                @read="readNotification" />
                        </div>
                    </transition-group>
                    <div v-if="newAnswer.length == 0" class="text">暂无回答
                    </div>
                </div>
                <div v-if="radio == 'new-reply'">
                    <transition-group name="notification">
                        <div v-for="item in newReply" :key="item.id">
                            <NotificationCard type="reply" :created_at="item.created_at" :id="item.id"
                                :is_read="item.is_read" :question_id="item.question_id"
                                :question_title="item.question_title" :question_content="item.question_content"
                                :answer_id="item.answer_id" :answer_content="item.answer_content"
                                :respondent_avatar="item.respondent_avatar" :respondent_name="item.respondent_name"
                                :respondent_id="item.respondent_id" :reply_id="item.reply_id"
                                :reply_content="item.reply_content" @reply="closeDrawer" @delete="deleteNotification"
                                @read="readNotification" />
                        </div>
                    </transition-group>
                    <div v-if="newReply.length == 0" class="text">暂无回复</div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getNotificationApi } from '@/api/notification/notification.api';
import type { NewQuestion, NewAnswer, NewReply } from '@/model/notification.model';
import { NotificationCard } from '@/components/notification-card';
import { onMounted, ref } from 'vue';

const radio = ref('new-question');

enum NotificationType {
    QUESTION = 'question',
    ANSWER = 'answer',
    REPLY = 'reply'
}

const emit = defineEmits(['closeDrawer']);

function closeDrawer() {
    emit('closeDrawer');
}

function deleteNotification(id: number, type: string) {
    console.log(id, type);
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
    await getNotificationApi(2).then((res) => {
        newQuestion.value = res.new_question
        newAnswer.value = res.new_answer
        newReply.value = res.new_reply
    }).catch((err) => {
        console.log(err)
    })
}

function readNotification(id: number, type: string, is_read: boolean) {
    console.log(id, type, is_read);
}

onMounted(async () => {
    await loadNotification()
    console.log(newReply.value);
})
</script>

<style scoped lang="scss">
.notification {
    display: flex;
    height: 100%;
    flex-direction: column;

    .title {
        font-size: 20px;
        font-weight: bold;
    }

    .choose-notification {
        margin-top: 10px;
        display: flex;
        justify-content: center;
    }

    .notification-container {
        display: flex;
        flex-direction: column;
        height: 90%;
        width: 360px;
        margin-top: 10px;

        .text {
            text-align: center;
            margin-top: 20px;
        }
    }
}
</style>