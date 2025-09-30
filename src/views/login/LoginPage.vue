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
                    <el-checkbox v-model="autoLogin" class="auto-login-checkbox"
                        >下次自动登录</el-checkbox
                    >
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
                        <el-button type="info" text large @click="navigateToUnlogin"
                            >暂不登录
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>

        <!-- 忘记密码弹窗 -->
        <ForgetPasswordPage v-model:visible="forgetPasswordVisible" />

        <!-- 注册弹窗 -->
        <RegisterPage v-model:visible="registerVisible" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User as UserIcon, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import ForgetPasswordPage from './ForgetPasswordPage.vue'
import RegisterPage from './RegisterPage.vue'
import type { LoginReq } from '@/model/user.model'
import { mailCheck } from '@/utils/login/register'
import { ControlPanelStore } from '@/store/modules/control-panel'
import { UserStore } from '@/store/modules/user'

const router = useRouter()
const loading = ref(false)
const forgetPasswordVisible = ref(false)
const registerVisible = ref(false)
const userNameOrEmail = ref('')
const password = ref('')
const autoLogin = ref(false)

const userStore = UserStore()

onMounted(async () => {
    // 如果用户选择了自动登录且本地有token，则尝试自动登录
    if (autoLogin.value || (userStore.getToken() && localStorage.getItem('autoLogin') === 'true')) {
        loading.value = true
        try {
            const userInfo = await userStore.autoLogin()
            if (userInfo && Object.keys(userInfo).length > 0) {
                ControlPanelStore().clearSelectedItem()
                ElMessage.success('自动登录成功')
                router.push({ name: 'AskAll' })
                return
            } else {
                // 如果心跳失败或无法获取用户信息，则重新登录
                await userStore.logout()
                throw new Error('无法获取用户信息，请重新登录')
            }
        } catch (error) {
            console.error('自动登录失败:', error)
            ElMessage.error('自动登录失败，请手动登录')
        } finally {
            loading.value = false
        }
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
            // 如果用户选择了自动登录，保存设置
            if (autoLogin.value) {
                localStorage.setItem('autoLogin', 'true')
            } else {
                localStorage.removeItem('autoLogin')
            }

            ControlPanelStore().clearSelectedItem()
            ElMessage.success('登录成功')
            router.push({ name: 'AskAll' })
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('登录失败，请检查用户名和密码')
    } finally {
        loading.value = false
    }
}

function navigateToUnlogin() {
    userStore.resetState()
    ControlPanelStore().setSelectedItem('ask-teacher')
    router.push({ name: 'AskTeacher' })
}

const openForgetPassword = () => {
    forgetPasswordVisible.value = true
}

const openRegister = () => {
    registerVisible.value = true
}
</script>

<style scoped lang="scss">
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

        .auto-login-checkbox {
            color: #909399;
        }

        .forget-password {
            color: #71b6ff;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: darken(#71b6ff, 10%);
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
