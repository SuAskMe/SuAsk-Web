<template>
    <div class="main">
        <div class="title">
            <p>基础信息</p>
            <hr />
        </div>
        <div class="basic-info">
            <div class="avatar-and-id">
                <el-avatar :size="deviceType == 'desktop' ? 200 : 150" :src="basicInfo.avatar" />
                <p> @{{ basicInfo.id }} </p>
            </div>
            <div class="name-and-bio">
                <p>昵称</p>
                <div>
                    <el-input v-model="basicInfo.name" placeholder="Please input" />
                </div>
                <p>简介</p>
                <div>
                    <bio-panel v-model="basicInfo.bio" />
                </div>
            </div>
            <div class="button" v-if="deviceType == 'desktop'">
                <el-button type="primary">保存</el-button>
            </div>
        </div>
        <div class="title">
            <p>主题</p>
            <hr />
        </div>
        <div class="theme">
            <theme-image :src="imgList" :width="deviceType == 'desktop' ? '100px' : '70px'" />
        </div>
        <div class="danger-place">
            <p class="danger-option">重置密码</p>
            <p class="danger-option">账户注销</p>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import BioPanel from '@/components/bio-panel';
import ThemeImage from './ThemeImage.vue';

const imgList = ref<string[]>([]);
const images = import.meta.glob('@/assets/bg_imgs/*.png', { eager: true });
imgList.value = Object.values(images).map((module) => (module as any).default);

const deviceType = inject('deviceType', 'desktop');

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

async function loadCss() {
    if (deviceType === 'desktop') {
        await import('./desktop.scss');
    } else {
        await import('./phone.scss');
    }

}

onMounted(() => {
    loadCss();
})

watch(() => deviceType, () => {
    loadCss();
})
</script>

<style lang="scss" scoped></style>
