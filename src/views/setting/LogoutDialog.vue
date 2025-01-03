<template>
    <div class="dialog">
        <el-dialog v-model="visible" :show-close="false" align-center width="300px">
            <div class="title">
                确定要退出登录吗?
            </div>
            <div class="main">
                <el-button @click="logout" type="primary">确定</el-button>
                <el-button @click="visible = false" type="default">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { logoutApi } from '@/api/user/login.api';
import { router } from '@/router';
import { removeUserInfo } from '@/utils/userInfo';
import { ElMessage } from 'element-plus';

const visible = defineModel("visible", { type: Boolean, default: true });

function logout() {
    logoutApi().then(res => {
        if (res) {
            ElMessage.success('注销成功');
            removeUserInfo();
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
.dialog {
    .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .main {
        display: flex;

        justify-content: space-between;
        align-items: center;
    }

}

:deep(.el-dialog) {
    border-radius: 20px;
}

:deep(.el-dialog__header) {
    padding: 0;
}
</style>