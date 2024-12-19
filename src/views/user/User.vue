<template>
    <el-container style="height: 100%;">
        <el-header class="header">
            <Header />
        </el-header>
        <el-main class="main">
            <div class="main-item">
                <el-avatar :size="200" :src="userInfo.avatar" />
                <p class="nickname">{{ userInfo.nickname }}</p>
                <p class="name">@{{ userInfo.name }}</p>
                <MdPreview :id="id" :modelValue="userInfo.introduction" />
            </div>
            <div v-if="userInfo.role == 'teacher'" class="teacher-item">
                1111
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang='ts'>
import { getUserByIdApi } from '@/api/user/user.api';
import type { User } from '@/model/user.model';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import Header from './Header.vue';

// md-editor
const id = 'preview-only';

// user info
const userInfo = ref<User>({
    id: 0,
    name: '',
    nickname: '',
    role: '',
    introduction: '',
    avatar: null,
    themeId: 0
});

const route = useRoute();


async function getUserInfo() {
    const userId = route.params.id.toString();
    await getUserByIdApi(userId).then(res => {
        userInfo.value = res.data;
        console.log(userInfo.value);
        const default_avatar = 'default-avatar';
        if (userInfo.value.avatar == default_avatar) {
            userInfo.value.avatar = new URL('@/assets/default-avatar.png', import.meta.url).href;
            console.log(userInfo.value.avatar);
        }
    }).catch(err => {
        console.log(err);
    });
}

onMounted(() => {
    getUserInfo();
});
</script>

<style scoped lang="scss">
.el-header {
    --el-header-padding: 0 !important;
}



.main {
    display: flex;
    flex-direction: column;
    padding: 5% 10%;
    height: 100%;

    .main-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        .nickname {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            margin: 0;
            margin-top: 10px;
        }

        .name {
            font-size: 18px;
            color: #666;
            margin-top: 10px;
            margin: 0;
            margin-top: 10px;
        }
    }

    .teacher-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: 20px;
    }
}
</style>