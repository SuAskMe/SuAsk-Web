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
import { checkOldPassword } from '@/api/user/reset_password.api';
import type { User } from '@/model/user.model';
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

async function resetPassword() {
    if (resetPasswordForm.value.oldPassword == '' || resetPasswordForm.value.newPassword == '' || resetPasswordForm.value.confirmPassword == '') {
        ElMessage.error('请填写完整信息');
        return;
    } else if (resetPasswordForm.value.newPassword != resetPasswordForm.value.confirmPassword) {
        ElMessage.error('两次输入的新密码不一致');
        return;
    } else if (userInfo.value && await checkOldPassword({ id: userInfo.value.id, oldPassword: resetPasswordForm.value.oldPassword })) {
        ElMessage.error('旧密码错误');
        return;
    }
    console.log(resetPasswordForm.value);
}

const userInfo = ref<User>()

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