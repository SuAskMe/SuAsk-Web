<template>
    <div class="main">
        <div class="main-item">
            <div class="title">
                <span>欢迎使用 SuAsk</span>
                <svg-icon icon="qr-code" color="#808080" size="20px" />
            </div>
            <div>
                <el-input
                    v-model="userNameOrEmail"
                    style="height: 40px"
                    placeholder="请输入用户名或邮箱"
                    clearable
                >
                    <template #prefix>
                        <svg-icon icon="user" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
            </div>
            <div>
                <el-input
                    v-model="password"
                    style="height: 40px"
                    placeholder="请输入密码"
                    clearable
                    show-password
                >
                    <template #prefix>
                        <svg-icon icon="key" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
            </div>
            <div style="display: flex; justify-content: space-between">
                <el-button type="info" text bg @click="() => {}"
                    >暂不登录</el-button
                >
                <el-button
                    type="primary"
                    style="width: 25%"
                    @click="login"
                    shouldAddSpace
                >
                    登 录
                </el-button>
            </div>
            <div class="footer">
                <span
                    @click="forgetPassword"
                    style="color: #808080; cursor: pointer"
                    >忘记密码</span
                >
                <span @click="register" style="color: #71b6ff; cursor: pointer"
                    >注册账号</span
                >
            </div>
        </div>
        <forget-password-page v-model:visible="showForgetPassword" />
        <register-page v-model:visible="showRegister" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ForgetPasswordPage from "./ForgetPasswordPage.vue";
import RegisterPage from "./RegisterPage.vue";
import { loginApi } from "@/api/user/login.api";
import { mailCheck } from "@/utils/login/register";
import type { LoginReq, User } from "@/model/user.model";
import { ElMessage } from "element-plus";
import { UserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";

const userNameOrEmail = ref("");
const password = ref("");

const router = useRouter();
const userStore = UserStore();

async function login() {
    if (userNameOrEmail.value == "" || password.value == "") {
        ElMessage.error("用户名或密码不能为空");
        return;
    }
    const loginReq: LoginReq = {
        name: "",
        email: "",
        password: password.value,
    };
    if (mailCheck(userNameOrEmail.value)) {
        loginReq.email = userNameOrEmail.value;
    } else {
        loginReq.name = userNameOrEmail.value;
    }
    try {
        const userInfo = await userStore.login(loginReq);
        if (userInfo) {
            ElMessage.success("登录成功");
            router.push({ name: "AskAll" });
            console.log(userStore.getUser);
        } else {
            ElMessage.error("登录失败");
        }
    } catch (e) {
        ElMessage.error((e as unknown as Error).message);
    }
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
        height: fit-content;
        width: 350px;
        padding: 30px 30px;
        gap: 20px;
        transition: filter 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-radius: 8px;

        .title {
            display: flex;
            justify-content: space-between;
            height: 30px;
            align-items: center;
            margin-top: 10px;
            padding-bottom: 20px;
            width: 100%;

            span {
                font-size: 22px;
                line-height: 30px;
                font-weight: bold;
                color: $su-blue;
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
