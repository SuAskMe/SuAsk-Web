<template>
    <div class="sidebar">
        <div class="title">
            <svg-icon  class="qr-code" icon="qr-code" color="#808080" size="24px" />
            <div v-if="role != 'default'" class="message">
                <svg-icon @click="openDrawer" icon="communicate_message_emoji" color="#808080" size="24px" />
                <div v-if="(newQuestionCount + newAnswerCount + newReplyCount) > 0" class="red-dot" />
            </div>
        </div>
        <div class="avatar-and-id" @click="toUserInfo">
            <el-avatar :size="120" :src="userInfo.avatar">
                <img src="@/assets/default-avatar.png" />
            </el-avatar>
            <div class="user-name">
                <span>{{ userInfo.nickname }}</span>
            </div>
            <div class="user-id">
                <span>@{{ userInfo.name }}</span>
            </div>
        </div>
        <div class="control-panel">
            <el-button v-if="role == 'default'" type="info" text class="login" @click="navigateToLogin">
                登录以获取更多功能
            </el-button>
            <student-item v-if="role == 'student'" />
            <teacher-item v-else-if="role == 'teacher'" />
            <default-item v-else-if="role == 'default'"/>
        </div>
    </div>
    <el-drawer class="drawer" v-model="drawer" :with-header="false" size="400" destroy-on-close>
        <Notification @close-drawer="closeDrawer" :question-count="newQuestionCount" :answer-count="newAnswerCount"
            :reply-count="newReplyCount" :user_id="userInfo.id"></Notification>
    </el-drawer>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';

import StudentItem from './StudentItem.vue';
import TeacherItem from './TeacherItem.vue';
import { ElMessage } from 'element-plus';
import { getNotificationCountApi } from '@/api/notification/notification.api';
import Notification from './Notification.vue';
import { UserStore } from '@/store/modules/user';
import DefaultItem from './DefaultItem.vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);

// 用户信息

const userStore = UserStore();
// const { userInfo } = storeToRefs(userStore);
const userInfo = computed(() => userStore.getUser())

const role = ref(userStore.getRole())


function closeDrawer() {
    console.log('closeDrawer');
    drawer.value = false;
}
async function openDrawer() {
    drawer.value = true;
}

const newQuestionCount = ref(0)
const newAnswerCount = ref(0)
const newReplyCount = ref(0)

async function getNotificationCount() {
    await getNotificationCountApi(userInfo.value.id).then((res) => {
        if (res != null) {
            newQuestionCount.value = res.new_question_count
            newAnswerCount.value = res.new_answer_count
            newReplyCount.value = res.new_reply_count
        }
        // console.log(res);

    }).catch((err) => {
        console.log(err);
    })
}

const router = useRouter();

function toUserInfo() {
    if (userInfo) {
        router.push(`/user/${userInfo.value.id}`)
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

function navigateToLogin() {
    router.push('/login')
}

onMounted(() => {
    if (role.value != 'default'){
        getNotificationCount();
    }
});
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

        .qr-code {
            cursor: pointer;
            padding: 5px;
            transition: transform 0.3s ease;
        }

        .qr-code:hover {
            transform: scale(1.1);
        }

        .message:hover {
            transform: scale(1.1);
        }

        .message {
            position: relative;
            cursor: pointer;
            padding: 5px;
            transition: transform 0.3s ease;

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

        .login {
            margin-top: 20px;
            cursor: pointer;
            height: 40px;
            border-radius: 20px;
        }
    }

    .drawer {
        display: flex;
        height: 100%;

        .title {
            font-size: 20px;
            font-weight: bold;
            padding: 20px 20px 10px 20px;
        }
    }

    .notification-enter-active,
    .notification-leave-active {
        transition: opacity 0.5s;
    }

    .notification-enter-from,
    .notification-leave-to {
        opacity: 0;
        transform: translateX(20px);
    }
}
</style>