<template>
    <div class="main">
        <div class="main-item" :class="{ blurred: showModel }">
            <div class="title">
                <span>欢迎使用 SuAsk</span>
                <svg-icon icon="qr-code" color="#808080" size="20px" />
            </div>
            <div>
                <a-input v-model="userName" :style="{ height: '40px' }" placeholder="请输入用户名或邮箱" allow-clear>
                    <template #prefix>
                        <svg-icon icon="user" color="#71B6FF" size="20px" />
                    </template>
                </a-input>
            </div>
            <div>
                <a-input-password v-model="password" placeholder="请输入密码" :style="{ height: '40px' }"
                    :defaultVisibility="false" allow-clear>
                    <template #prefix>
                        <svg-icon icon="key" color="#71B6FF" size="20px" />
                    </template>
                </a-input-password>
            </div>
            <div>
                <a-button @click="login" type="primary" long>登录</a-button>
            </div>
            <div class="footer">
                <span @click="forgetPassword" style="color: #808080;">忘记密码</span>
                <span @click="register" style="color: #71B6FF;">注册账号</span>
            </div>
        </div>

        <div v-if="showModel" class="modal-overlay">
            <forget-password-page v-if="showForgetPassword" />
            <register-page v-if="showRegister" />
        </div>
    </div>

</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import ForgetPasswordPage from './ForgetPasswordPage.vue';
import RegisterPage from './RegisterPage.vue';

const userName = ref('');
const password = ref('');
const isMobile = ref(false);

function login() {
    console.log(userName.value, password.value);
}

const showForgetPassword = ref(false);
const showRegister = ref(false);
const showModel = computed(() => showForgetPassword.value || showRegister.value);

function forgetPassword() {
    showForgetPassword.value = true;
}

function register() {
    showRegister.value = true;
}

onMounted(() => {
    isMobile.value = JSON.parse(localStorage.getItem('isMobile') || 'false');
})



</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    .main-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100vh;
        width: 400px;
        padding: 0 20px;
        gap: 20px;
        transition: filter 0.3s ease;

        .title {
            display: flex;
            justify-content: space-between;
            height: 30px;
            align-items: center;
            padding-bottom: 20px;
            width: 100%;

            span {
                font-size: 22px;
                line-height: 30px;
                font-weight: bold;
            }
        }

        .footer {
            display: flex;
            justify-content: space-between;
            height: 30px;
            align-items: center;
            width: 100%;

            span {
                font-size: 16px;
                line-height: 30px;
            }
        }
    }

    .main-item.blurred {
        filter: blur(5px);
        /* 模糊效果 */
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
}
</style>