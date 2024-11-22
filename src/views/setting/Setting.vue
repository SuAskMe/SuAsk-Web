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
                    <a-textarea v-model="basicInfo.bio" allow-clear />
                </div>
            </div>
            <div>
                <a-button type="primary">保存</a-button>
            </div>
        </div>
        <p>密码</p>
        <div class="password">

        </div>
        <p>主题</p>
        <div class="theme">

        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import { MdEditor } from 'md-editor-v3';

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
    align-items: center;
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
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
    }
}
</style>
