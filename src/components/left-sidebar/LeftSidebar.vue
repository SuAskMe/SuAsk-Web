<template>
    <div class="sidebar">
        <div class="title">
            <svg-icon icon="qr-code" color="#808080" size="24px" />
            <div class="message">
                <svg-icon @click="openDrawer" icon="communicate_message_emoji" color="#808080" size="24px" />
                <div class="red-dot" />
            </div>

        </div>
        <div class="avatar-and-id" @click="toUserInfo">
            <el-avatar :size="120" :src="basicInfo.avatar">
                <img src="@/assets/default-avatar.png" />
            </el-avatar>
            <div class="user-name">
                <span>{{ basicInfo.name }}</span>
            </div>
            <div class="user-id">
                <span>@{{ basicInfo.nickname }}</span>
            </div>
        </div>
        <div class="control-panel">
            <student-item v-if="isStudent" />
            <teacher-item v-if="!isStudent" />
        </div>
    </div>
    <el-drawer class="drawer" v-model="drawer" :with-header="false" size="400" destroy-on-close>
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">消息</div>
        <el-tabs class="demo-tabs" stretch>
            <el-tab-pane>
                <template #label>
                    <div class="custom-tabs-label">
                        <span style="vertical-align: middle; margin-left: 4px;">提问我的</span>
                    </div>
                </template>
                <el-scrollbar>
                    <div v-for="item in newQuestion" :key="item.id" style="width: 340px;">
                        <NotificationCard type="question" :created_at="item.created_at" :id="item.id"
                            :is_read="item.is_read" :question_id="item.question_id"
                            :question_title="item.question_title" :question_content="item.question_content"
                            :user_avatar="item.user_avatar" :user_name="item.user_name" :user_id="item.user_id"
                            @reply="closeDrawer" @delete="deleteNotification" @read="readNotification" />
                    </div>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <div class="custom-tabs-label">
                        <span style="vertical-align: middle; margin-left: 4px;">回答我的</span>
                    </div>
                </template>
                <el-scrollbar>
                    <div v-for="item in newAnswer" :key="item.id" style="width: 340px;">
                        <NotificationCard type="answer" :created_at="item.created_at" :id="item.id"
                            :is_read="item.is_read" :question_id="item.question_id"
                            :question_title="item.question_title" :question_content="item.question_content"
                            :answer_id="item.answer_id" :answer_content="item.answer_content"
                            :respondent_avatar="item.respondent_avatar" :respondent_name="item.respondent_name"
                            :respondent_id="item.respondent_id" @reply="closeDrawer" @delete="deleteNotification"
                            @read="readNotification" />
                    </div>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <div class="custom-tabs-label">
                        <span style="vertical-align: middle; margin-left: 4px;">回复我的</span>
                    </div>
                </template>
                <el-scrollbar>
                    <div v-for="item in newReply" :key="item.id" style="width: 340px;">
                        <NotificationCard type="reply" :created_at="item.created_at" :id="item.id"
                            :is_read="item.is_read" :question_id="item.question_id"
                            :question_title="item.question_title" :question_content="item.question_content"
                            :answer_id="item.answer_id" :answer_content="item.answer_content"
                            :respondent_avatar="item.respondent_avatar" :respondent_name="item.respondent_name"
                            :respondent_id="item.respondent_id" :reply_id="item.reply_id"
                            :reply_content="item.reply_content" @reply="closeDrawer" @delete="deleteNotification"
                            @read="readNotification" />
                    </div>
                </el-scrollbar>

            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue';

import StudentItem from './StudentItem.vue';
import TeacherItem from './TeacherItem.vue';
import type { User } from '@/model/user.model';
import { ElMessage } from 'element-plus';
import { router } from '@/router';
import { getUserInfo } from '@/utils/userInfo';
import { getNotificationApi, getNotificationCountApi } from '@/api/notification/notification.api';
import type { NewAnswer, NewQuestion, NewReply } from '@/model/notification.model';
import { NotificationCard } from '@/components/notification-card';

const drawer = ref(false);

const userInfo = getUserInfo();

interface basicInfo {
    id: number;
    avatar: string;
    name: string;
    nickname: string;
}

// 用户信息

const basicInfo = ref<basicInfo>({
    id: 0,
    avatar: '',
    name: '',
    nickname: '',
});

function loadUserInfo() {
    if (userInfo) {
        const parsedUserInfo = userInfo
        basicInfo.value.avatar = parsedUserInfo.avatar?.toString() || ''
        basicInfo.value.name = parsedUserInfo.name
        basicInfo.value.nickname = parsedUserInfo.nickname
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

function closeDrawer() {
    console.log('closeDrawer');
    drawer.value = false;
}
async function openDrawer() {
    await loadNotification();
    console.log(newAnswer.value);
    drawer.value = true;
}

const newQuestion = ref<NewQuestion[]>([])
const newAnswer = ref<NewAnswer[]>([])
const newReply = ref<NewReply[]>([])

async function loadNotification() {
    await getNotificationApi(2).then((res) => {
        newQuestion.value = res.new_question
        newAnswer.value = res.new_answer
        newReply.value = res.new_reply
        console.log(newQuestion);

    }).catch((err) => {
        console.log(err)
    })
}

enum NotificationType {
    QUESTION = 'question',
    ANSWER = 'answer',
    REPLY = 'reply'
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

function readNotification(id: number, type: string, is_read: boolean) {
    console.log(id, type, is_read);
}

const newQuestionCount = ref(0)
const newAnswerCount = ref(0)
const newReplyCount = ref(0)

async function getNotificationCount() {
    await getNotificationCountApi(2).then((res) => {
        if (res != null) {
            newQuestionCount.value = res.new_question_count
            newAnswerCount.value = res.new_answer_count
            newReplyCount.value = res.new_reply_count
        }
        console.log(res);

    }).catch((err) => {
        console.log(err);
    })
}



function toUserInfo() {
    if (userInfo) {
        router.push(`/user/${userInfo.id}`)
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

onMounted(() => {
    loadUserInfo();
    getNotificationCount();
});

const props = defineProps({
    userType: String
});

const isStudent = computed(() => props.userType === 'student');
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    width: 300px;
    border-right: 1px solid $su-border;

    .title {
        height: 80px;
        padding: 20px 10% 0 10%;
        display: flex;
        justify-content: space-between;

        .message {
            position: relative;
            cursor: pointer;
            padding: 5px;

            .red-dot {
                width: 10px;
                height: 10px;
                background-color: red;
                border-radius: 50%;
                position: absolute;
                top: 2px;
                right: 0;
                animation: scale-in-center 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) both;
            }

            @keyframes scale-in-center {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }

                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        }
    }

    .avatar-and-id {
        padding: 0 10%;

        .el-avatar {
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .el-avatar:hover {
            transform: scale(1.1);
        }

        .user-name {
            cursor: pointer;
            text-align: left;
            font-size: 25px;
            font-weight: bold;
            margin-top: 10px;
        }

        .user-name:hover {
            text-decoration: underline;
        }

        .user-id {
            cursor: pointer;
            text-align: left;
            font-size: 13px;
            color: #808080;
            margin-top: 10px;
        }
    }

    .control-panel {
        padding: 0 10%;
    }

    .drawer {
        display: flex;

        .title {
            font-size: 20px;
            font-weight: bold;
            padding: 20px 20px 10px 20px;
        }
    }


}
</style>