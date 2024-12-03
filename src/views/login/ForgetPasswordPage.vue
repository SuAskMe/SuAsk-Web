<template>
    <div v-if="showForgetPassword" class="modal">
        <p>忘记密码</p>
        <el-input v-model="forgetPasswordForm.mail" style="height: 40px;" placeholder="请输入注册邮箱" clearable>
            <template #prefix>
                <svg-icon icon="mail" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <div class="button">
            <el-button @click="jumpToVerification" type="primary">确定</el-button>
        </div>
    </div>
    <div v-if="showVerification" class="modal">
        <p>请输入邮箱验证码</p>
        <el-input v-model="forgetPasswordForm.verificationCode" style="height: 40px;" placeholder="请输入验证码" clearable />
        <div class="button">
            <el-button @click="jumpToResetPassword" type="primary">确定</el-button>
        </div>
    </div>
    <div v-if="showResetPassword" class="modal">
        <p>重置密码</p>
        <el-input v-model="forgetPasswordForm.newPassword" placeholder="请输入新密码" style="height: 40px;" clearable
            show-password>
            <template #prefix>
                <svg-icon icon="key" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <el-input v-model="forgetPasswordForm.confirmPassword" placeholder="请再次输入新密码" style="height: 40px;" clearable
            show-password>
            <template #prefix>
                <svg-icon icon="key" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <div class="button">
            <el-button @click="resetPassword" type="primary">确定</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { router } from '@/router';
import { ref, watchEffect } from 'vue';

export interface ForgetPasswordForm {
    mail: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
}

const forgetPasswordForm = ref<ForgetPasswordForm>({
    mail: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
});


const showForgetPassword = ref(true);
const showVerification = ref(false);
const showResetPassword = ref(false);


async function jumpToVerification() {
    showForgetPassword.value = false;
    showVerification.value = true;
}

function jumpToResetPassword() {
    showVerification.value = false;
    showResetPassword.value = true;
}

function resetPassword() {
    router.push('/login');
    window.location.reload();
}

function closed() {
    showForgetPassword.value = true;
    showVerification.value = false;
    showResetPassword.value = false;
    forgetPasswordForm.value = {
        mail: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
    };
}
const props = defineProps<{
    closed: boolean;
}>();

watchEffect(() => {
    if (props.closed) {
        closed();
    }
});
</script>

<style scoped>
.modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .button {
        width: 100%;
        display: flex;
        justify-content: end;

        .el-button {
            width: 40%;
            height: 30px;
            border-radius: 15px;
        }
    }
}
</style>