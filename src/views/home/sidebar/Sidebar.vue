<template>
    <div class="sidebar">
        <div class="title">
            <svg-icon icon="qr-code" color="#808080" size="24px" />
            <svg-icon icon="communicate_message_emoji" color="#808080" size="24px" />
        </div>
        <div class="avatar-and-id" @click="toUserInfo">
            <el-avatar :size="120" :src="basicInfo.avatar" />
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
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';

import StudentItem from './StudentItem.vue';
import TeacherItem from './TeacherItem.vue';
import type { User } from '@/model/user.model';
import { ElMessage } from 'element-plus';
import { router } from '@/router';

const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) as User : null;

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

function getUserInfo() {
    if (userInfo) {
        const parsedUserInfo = userInfo
        basicInfo.value.avatar = parsedUserInfo.avatar
        basicInfo.value.name = parsedUserInfo.name
        basicInfo.value.nickname = parsedUserInfo.nickname
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

function toUserInfo() {
    if (userInfo) {
        router.push(`/home/user/${userInfo.id}`)
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

onMounted(() => {
    getUserInfo();
});

const props = defineProps({
    userType: String
});

const isStudent = computed(() => props.userType === 'student');
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;

    .title {
        height: 80px;
        padding: 20px 10% 0 10%;
        display: flex;
        justify-content: space-between;
    }

    .avatar-and-id {
        padding: 0 10%;

        .user-name {
            text-align: left;
            font-size: 25px;
            font-weight: bold;
            margin-top: 10px;
        }

        .user-id {
            text-align: left;
            font-size: 13px;
            color: #808080;
            margin-top: 10px;
        }
    }

    .control-panel {
        padding: 0 10%;
    }
}
</style>