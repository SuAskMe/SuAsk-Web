<template>
    <div class="sidebar">
        <div class="title">
            <svg-icon icon="qr-code" color="#808080" size="24px" />
            <svg-icon icon="communicate_message_emoji" color="#808080" size="24px" />
        </div>
        <div class="avatar-and-id">
            <el-avatar :size="120" :src="userAvatar" />
            <div class="user-name">
                <span>{{ userName }}</span>
            </div>
            <div class="user-id">
                <span>@{{ userId }}</span>
            </div>
        </div>
        <div class="control-panel">
            <student-item v-if="isStudent" />
            <teacher-item v-if="!isStudent" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';

import StudentItem from './StudentItem.vue';
import TeacherItem from './TeacherItem.vue';

// 用户信息
const userAvatar = ref("https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp");
const userId = ref("GenshinStart");
const userName = ref("原神启动");

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