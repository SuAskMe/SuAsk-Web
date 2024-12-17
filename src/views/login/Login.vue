<template>
    <div class="main">
        <div class="main-item">
            <div class="title">
                <span>欢迎使用 SuAsk</span>
                <svg-icon icon="qr-code" color="#808080" size="20px" />
            </div>
            <div>
                <el-input v-model="userNameOrEmail" style="height: 40px;" placeholder="请输入用户名或邮箱" clearable>
                    <template #prefix>
                        <svg-icon icon="user" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
            </div>
            <div>
                <el-input v-model="password" style="height: 40px;" placeholder="请输入密码" clearable show-password>
                    <template #prefix>
                        <svg-icon icon="key" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
            </div>
            <div>
                <el-button type="primary" long @click="login">登录</el-button>
            </div>
            <div class="footer">
                <span @click="forgetPassword" style="color: #808080;">忘记密码</span>
                <span @click="register" style="color: #71B6FF;">注册账号</span>
            </div>
        </div>
        <el-dialog v-model="showForgetPassword" width="400px" align-center>
            <forget-password-page :closed="showForgetPassword" />
        </el-dialog>
        <el-dialog v-model="showRegister" width="400px" align-center>
            <register-page :closed="showRegister" />
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import ForgetPasswordPage from './ForgetPasswordPage.vue';
import RegisterPage from './RegisterPage.vue';
import { loginApi } from '@/api/user/login.api';
import { getUserInfoApi } from '@/api/user/user.api';
import { mailCheck } from '@/utils/login/register';
import type { LoginReq, LoginRes } from '@/model/user.model';
import { ElMessage } from 'element-plus';

const userNameOrEmail = ref('');
const password = ref('');

async function login() {
    if (userNameOrEmail.value == '' || password.value == '') {
        ElMessage.error('用户名或密码不能为空');
        return;
    }
    const loginData: LoginReq = {
        name: '',
        email: '',
        password: password.value
    }
    console.log(userNameOrEmail.value, password.value);
    if (mailCheck(userNameOrEmail.value)) {
        loginData.email = userNameOrEmail.value;
    } else {
        loginData.name = userNameOrEmail.value;
    }
    await loginApi(loginData).then(res => {
        console.log(res);
        const user: LoginRes = res.data;
        const token = res.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
        console.log(user);
    }).catch(err => {
        console.log(err);
    });
}

async function getUserInfo() {
    const res = await getUserInfoApi()
    const userInfo = res.data;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

const showForgetPassword = ref(false);
const showRegister = ref(false);

function forgetPassword() {
    showForgetPassword.value = true;
}

function register() {
    showRegister.value = true;
}

</script>

<style scoped lang="scss">
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
}

:deep(.el-dialog) {
    border-radius: 20px;
}
</style>