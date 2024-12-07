<template>
    <div class="logout-main">
        <el-button @click="logout" type="primary">确定</el-button>
    </div>
</template>

<script setup lang='ts'>
import { logoutApi } from '@/api/user/login.api';
import { router } from '@/router';
import { ElMessage } from 'element-plus';

function logout() {
    logoutApi().then(res => {
        if (res) {
            ElMessage.success('注销成功');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            router.push('/login');
        } else {
            ElMessage.error('注销失败');
        }
    }).catch(err => {
        console.log(err);
    })
}
</script>

<style scoped lang="scss">
.logout-main {
    display: flex;
    height: 50px;
    flex-direction: column;
    align-items: center;

    .el-button {
        margin-top: auto;
        margin-right: auto;
    }
}
</style>