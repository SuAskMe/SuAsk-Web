<template>
    <div class="dialog-main">
        <p>重置密码</p>
        <el-input v-model="resetPasswordForm.oldPassword" placeholder="请输入旧密码" />
        <el-input v-model="resetPasswordForm.newPassword" placeholder="请输入新密码" />
        <el-input v-model="resetPasswordForm.confirmPassword" placeholder="请再次输入新密码" />
        <el-button type="primary" @click="resetPassword">确认</el-button>
    </div>
</template>

<script setup lang='ts'>
import { checkOldPasswordApi, resetPasswordApi } from '@/api/user/reset_password.api';
import type { ResetPassword, User } from '@/model/user.model';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';


interface resetPasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const resetPasswordForm = ref<resetPasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const userInfo = ref<User>()

async function resetPassword() {
    if (resetPasswordForm.value.oldPassword == '' || resetPasswordForm.value.newPassword == '' || resetPasswordForm.value.confirmPassword == '') {
        ElMessage.error('请填写完整信息');
        return;
    } else if (resetPasswordForm.value.newPassword != resetPasswordForm.value.confirmPassword) {
        ElMessage.error('两次输入的新密码不一致');
        return;
    } else if (userInfo.value && await checkOldPasswordApi({ id: userInfo.value.id, oldPassword: resetPasswordForm.value.oldPassword })) {
        ElMessage.error('旧密码错误');
        return;
    }
    if (!userInfo.value?.id) {
        ElMessage.error('用户ID不存在');
        return;
    }
    const req: ResetPassword = {
        id: userInfo.value.id,
        newPassword: resetPasswordForm.value.newPassword
    }
    resetPasswordApi(req).then(res => {
        if (res) {
            ElMessage.success('密码修改成功');
        } else {
            ElMessage.error('密码修改失败');
        }
    }).catch(err => {
        ElMessage.error('密码修改失败', err);
    })
}



function getUserInfo() {
    let tmp = localStorage.getItem('userInfo')
    if (tmp) {
        userInfo.value = JSON.parse(tmp)
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

onMounted(() => {
    getUserInfo()
})

</script>

<style scoped lang="scss">
.dialog-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .el-form {
        width: 100%;
    }
}
</style>