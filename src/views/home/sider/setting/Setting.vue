<template>
    <div class="main">
        <p>基础信息</p>
        <div class="basic-info">
            <div class="avatar-and-id">
                <a-avatar :style="{ backgroundColor: '#14a9f8' }" :size="100">
                    <img :src="basicInfo.avatar" />
                </a-avatar>
                <p> @{{ basicInfo.id }} </p>
            </div>
            <div class="name-and-bio">
                <p>昵称</p>
                <div>
                    <a-input v-model="basicInfo.name" />
                </div>
                <p>简介</p>
                <div>
                    <bio-panel v-model="basicInfo.bio" style="width: 300px;" />
                </div>
            </div>
            <div>
                <a-button type="primary">保存</a-button>
            </div>
        </div>
        <p>主题</p>
        <div class="theme">
            <theme-image :src="imgList" width="100px" />
        </div>
        <p class="danger-option">重置密码</p>
        <p class="danger-option">账户注销</p>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import BioPanel from '@/components/bio-panel';
import ThemeImage from './ThemeImage.vue';

const imgList = ref<string[]>([]);
const images = import.meta.glob('@/assets/bg_imgs/*.png', { eager: true });
imgList.value = Object.values(images).map((module) => (module as any).default);

interface BasicInfo {
    avatar: string
    id: string
    name: string
    bio: string
}

const basicInfo: BasicInfo = reactive({
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    id: 'GenshinStart',
    name: '原神启动',
    bio: '原神启动的个人简介',
})
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    height: 100%;
    padding: 0 10%;

    .basic-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 20px;

        .avatar-and-id {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .name-and-bio {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;
        }
    }

    .theme {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .danger-option {
        color: red;
        cursor: pointer;
    }

    .danger-option:hover {
        font-weight: bold;
    }
}
</style>
