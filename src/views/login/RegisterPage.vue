<template>
    <div v-if="showRegister" class="modal">
        <p>注册账号</p>
        <el-input v-model="registerMail" style="height: 40px;" placeholder="请输入注册用户名" clearable>
            <template #prefix>
                <svg-icon icon="user" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <div style="height: 10px;" />
        <el-input v-model="registerMail" style="height: 40px;" placeholder="请输入注册邮箱" clearable>
            <template #prefix>
                <svg-icon icon="mail" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <div style="margin-top: 20px;">
            <el-button @click="jumpToVerification" type="primary">确定</el-button>
        </div>
    </div>
    <div v-if="showVerification" class="modal">
        <p>请输入邮箱验证码</p>
        <el-input v-model="verificationCode" style="height: 40px;" placeholder="请输入验证码" clearable />
        <div style="margin-top: 20px;">
            <el-button @click="jumpToSetPassword" type="primary">确定</el-button>
        </div>
    </div>
    <div v-if="showSetPassword" class="modal">
        <p>设置密码</p>
        <el-input v-model="newPassword" placeholder="请输入新密码" style="height: 40px;" clearable show-password>
            <template #prefix>
                <svg-icon icon="key" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <div style="height: 10px;" />
        <el-input v-model="confirmPassword" placeholder="请再次输入新密码" style="height: 40px;" clearable show-password>
            <template #prefix>
                <svg-icon icon="key" color="#71B6FF" size="20px" />
            </template>
        </el-input>
        <div style="margin-top: 20px;">
            <el-button @click="register" type="primary">确定</el-button>
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

function register() {
    router.push('/login');
    window.location.reload();
}

const showRegister = ref(true);
const showVerification = ref(false);
const showSetPassword = ref(false);

function jumpToVerification() {
    showRegister.value = false;
    showVerification.value = true;
}

function jumpToSetPassword() {
    showVerification.value = false;
    showSetPassword.value = true;
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