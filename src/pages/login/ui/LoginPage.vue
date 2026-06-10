<template>
    <div class="login-container">
        <div class="login-background">
            <div class="floating-shape shape1"></div>
            <div class="floating-shape shape2"></div>
        </div>

        <div class="login-card">
            <div class="login-header">
                <h1 class="login-title">欢迎使用 SuAsk</h1>
            </div>

            <div class="login-form">
                <div class="form-item">
                    <el-input
                        v-model="userNameOrEmail"
                        placeholder="用户名/邮箱"
                        :prefix-icon="UserIcon"
                        size="large"
                    />
                </div>

                <div class="form-item">
                    <el-input
                        v-model="password"
                        placeholder="密码"
                        :prefix-icon="Lock"
                        size="large"
                        show-password
                    />
                </div>

                <div class="form-options">
                    <span class="forget-password" @click="openForgetPassword">忘记密码?</span>
                </div>

                <el-button
                    type="primary"
                    class="login-button"
                    size="large"
                    :loading="loading"
                    @click="handleLogin"
                >
                    登录
                </el-button>

                <div class="register-link">
                    还没有账号? <span @click="openRegister">立即注册</span>
                </div>
            </div>

            <div class="social-login">
                <div class="social-divider">
                    <span>或者</span>
                </div>
                <div class="unlogin-btn">
                    <el-tooltip
                        content="不登录可以完全匿名，但部分功能会受到限制"
                        placement="bottom"
                        effect="light"
                    >
                        <el-button
                            type="info"
                            text
                            large
                            :loading="guestLoading"
                            @click="navigateToUnlogin"
                            >暂不登录
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>

        <ForgetPasswordDialog v-model:visible="forgetPasswordVisible" />
        <RegisterDialog v-model:visible="registerVisible" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User as UserIcon, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { useRouter } from 'vue-router'
import ForgetPasswordDialog from './ForgetPasswordDialog.vue'
import RegisterDialog from './RegisterDialog.vue'
import type { LoginReq } from '@/entities/session'
import { mailCheck } from '@/shared/lib/account-validation'
import { ControlPanelStore } from '@/shared/model'
import { UserStore } from '@/entities/user'

const router = useRouter()
const loading = ref(false)
const forgetPasswordVisible = ref(false)
const registerVisible = ref(false)
const userNameOrEmail = ref('')
const password = ref('')

const userStore = UserStore()

onMounted(async () => {
    if (userStore.isLoggedIn()) {
        ControlPanelStore().clearSelectedItem()
        router.push({ name: 'AskTeacher' })
        return
    }

    if (userStore.authReady) {
        return
    }

    // With cookie auth, try restoring session on page load.
    // If the cookie is valid, bootstrapAuth restores user info.
    const user = await userStore.bootstrapAuth()
    if (user) {
        ControlPanelStore().clearSelectedItem()
        router.push({ name: 'AskTeacher' })
    }
})

const handleLogin = async () => {
    if (userNameOrEmail.value == '' || password.value == '') {
        ElMessage.error('用户名或密码不能为空')
        return
    }
    const loginReq: LoginReq = {
        name: '',
        email: '',
        password: password.value,
    }
    if (mailCheck(userNameOrEmail.value)) {
        loginReq.email = userNameOrEmail.value
    } else {
        loginReq.name = userNameOrEmail.value
    }

    loading.value = true
    try {
        const userInfo = await userStore.login(loginReq)

        if (userInfo) {
            ControlPanelStore().clearSelectedItem()
            ElMessage.success('登录成功')
            router.push({ name: 'AskTeacher' })
        }
    } catch {
        ElMessage.error('登录失败，请检查用户名和密码')
    } finally {
        loading.value = false
    }
}

const guestLoading = ref(false)

async function navigateToUnlogin() {
    guestLoading.value = true
    try {
        const userInfo = await userStore.guestLogin()
        if (userInfo) {
            ControlPanelStore().clearSelectedItem()
            router.push({ name: 'AskTeacher' })
        } else {
            ElMessage.error('临时登录失败，请稍后再试')
        }
    } catch (error: unknown) {
        // 处理 429 限流错误
        if (isRateLimitError(error)) {
            ElMessage.error('请求过于频繁，请稍后再试')
        } else {
            ElMessage.error('临时登录失败，请稍后再试')
        }
    } finally {
        guestLoading.value = false
    }
}

const openForgetPassword = () => {
    forgetPasswordVisible.value = true
}

const openRegister = () => {
    registerVisible.value = true
}

function isRateLimitError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
        return false
    }
    const maybeError = error as {
        response?: { status?: number }
        code?: number | string
    }
    return maybeError.response?.status === 429 || Number(maybeError.code) === 429
}
</script>

<style scoped lang="scss">
@use 'sass:color';

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    position: relative;
    overflow: hidden;
}

.login-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.floating-shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
    filter: blur(60px);
}

.shape1 {
    width: 350px;
    height: 350px;
    background: rgba(113, 182, 255, 0.4);
    top: -100px;
    left: -100px;
    animation-delay: 0s;
}

.shape2 {
    width: 350px;
    height: 350px;
    background: rgba(255, 208, 122, 0.3);
    bottom: 10%;
    left: 5%;
    animation-delay: -2s;
}

.login-card {
    width: 420px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    animation: fadeIn 0.8s ease-in-out;

    @media (max-width: 768px) {
        width: 80%;
        padding: 30px 20px;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 30px;

    .login-title {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
    }
}

.login-form {
    .form-item {
        margin-bottom: 20px;

        :deep(.el-input__wrapper) {
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            padding: 6px 10px;
            transition: all 0.3s;

            &.is-focus {
                box-shadow: 0 0 0 2px rgba(113, 182, 255, 0.3);
            }
        }

        :deep(.el-input__prefix) {
            color: #71b6ff;
            margin-right: 8px;
        }
    }

    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        font-size: 14px;

        .forget-password {
            color: #71b6ff;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: color.adjust(#71b6ff, $lightness: -10%);
                text-decoration: underline;
            }
        }
    }

    .login-button {
        width: 100%;
        height: 48px;
        font-size: 16px;
        border-radius: 8px;
        background: linear-gradient(135deg, $su-blue 0%, $su-blue-dark 100%);
        border: none;
        margin-bottom: 20px;
        transition:
            transform 0.3s,
            box-shadow 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(113, 182, 255, 0.4);
        }

        &:active {
            transform: translateY(0);
        }
    }

    .register-link {
        text-align: center;
        font-size: 14px;
        color: #666;

        span {
            color: #71b6ff;
            cursor: pointer;
            font-weight: 500;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}

.social-login {
    margin-top: 30px;

    .social-divider {
        position: relative;
        text-align: center;
        margin-bottom: 20px;

        &:before,
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            width: 35%;
            height: 1px;
            background-color: #ddd;
        }

        &:before {
            left: 0;
        }

        &:after {
            right: 0;
        }

        span {
            background-color: white;
            padding: 0 10px;
            font-size: 14px;
            color: #999;
        }
    }

    .unlogin-btn {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
