<template>
    <div class="sidebar">
        <div class="title">
            <svg-icon class="qr-code" icon="qr-code" color="#808080" size="24px" />
            <div class="message">
                <svg-icon @click="openDrawer" icon="communicate_message_emoji" color="#808080" size="24px" />
                <div class="red-dot" />
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
            <student-item v-if="isStudent" />
            <teacher-item v-if="!isStudent" />
        </div>
    </div>
    <el-drawer class="drawer" v-model="drawer" :with-header="false" size="400" destroy-on-close>
        <Notification @close-drawer="closeDrawer"></Notification>
    </el-drawer>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';

import StudentItem from './StudentItem.vue';
import TeacherItem from './TeacherItem.vue';
import { ElMessage } from 'element-plus';
import { router } from '@/router';
import { getUserInfo } from '@/utils/userInfo';
import { getNotificationCountApi } from '@/api/notification/notification.api';
import Notification from './Notification.vue';
import { UserInfoStore } from '@/store/modules/sidebar';
import { storeToRefs } from 'pinia';

const drawer = ref(false);

// 用户信息

const userStore = UserInfoStore();
const { userInfo } = storeToRefs(userStore);

function loadUserInfo() {
    userInfo.value = getUserInfo();
}

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
    await getNotificationCountApi(2).then((res) => {
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

function toUserInfo() {
    if (userInfo) {
        router.push(`/user/${userInfo.value.id}`)
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

onMounted(() => {
    loadUserInfo();
    getNotificationCount();
});

const isStudent = getUserInfo()?.role === 'student';
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