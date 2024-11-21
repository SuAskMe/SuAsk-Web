<template>
    <div v-if="showForgetPassword" class="modal">
        <p>忘记密码</p>
        <a-input v-model="registerMail" :style="{ height: '40px' }" placeholder="请输入注册邮箱" allow-clear>
            <template #prefix>
                <svg-icon icon="mail" color="#71B6FF" size="20px" />
            </template>
        </a-input>
        <div style="margin-top: 20px;">
            <a-button @click="jumpToVerification" type="primary" long>确定</a-button>
        </div>
    </div>
    <div v-if="showVerification" class="modal">
        <p>请输入邮箱验证码</p>
        <a-input v-model="verificationCode" :style="{ height: '40px' }" placeholder="请输入验证码" allow-clear />
        <div style="margin-top: 20px;">
            <a-button @click="jumpToResetPassword" type="primary" long>确定</a-button>
        </div>
    </div>
    <div v-if="showResetPassword" class="modal">
        <p>重置密码</p>
        <a-input-password v-model="newPassword" placeholder="请输入新密码" :style="{ height: '40px' }"
            :defaultVisibility="false" allow-clear>
            <template #prefix>
                <svg-icon icon="key" color="#71B6FF" size="20px" />
            </template>
        </a-input-password>
        <div style="height: 10px;" />
        <a-input-password v-model="confirmPassword" placeholder="请再次输入新密码" :style="{ height: '40px' }"
            :defaultVisibility="false" allow-clear>
            <template #prefix>
                <svg-icon icon="key" color="#71B6FF" size="20px" />
            </template>
        </a-input-password>
        <div style="margin-top: 20px;">
            <a-button @click="resetPassword" type="primary" long>确定</a-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { router } from '@/router';
import { ref } from 'vue';

const registerMail = ref('');
const verificationCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');


const showForgetPassword = ref(true);
const showVerification = ref(false);
const showResetPassword = ref(false);


function jumpToVerification() {
    showForgetPassword.value = false;
    showVerification.value = true;
}

function jumpToResetPassword() {
    showVerification.value = false;
    showResetPassword.value = true;
}

function resetPassword() {
    showResetPassword.value = false;
    router.push('/login');
    window.location.reload();
}
</script>

<style scoped>
.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    z-index: 1100;
    /* 确保在模糊层上方 */
    width: 300px;
    max-width: 80%;
}
</style>