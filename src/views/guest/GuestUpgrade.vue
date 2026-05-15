<template>
    <el-container class="container">
        <el-header class="header">
            <QuestionHeader sidebar_btn @sidebar="sidebar" />
        </el-header>
        <el-scrollbar>
            <el-main class="main-container">
                <div class="upgrade-card">
                    <div class="upgrade-header">
                        <h2>升级为正式账号</h2>
                        <p class="upgrade-desc">完善以下信息，即可解锁全部功能</p>
                    </div>

                    <el-form
                        ref="formRef"
                        :model="form"
                        :rules="rules"
                        label-position="top"
                        class="upgrade-form"
                    >
                        <el-form-item label="用户名" prop="name">
                            <el-input
                                v-model="form.name"
                                placeholder="请输入用户名（1-50个字符）"
                                maxlength="50"
                                show-word-limit
                            />
                        </el-form-item>

                        <el-form-item label="邮箱" prop="email">
                            <el-input
                                v-model="form.email"
                                placeholder="请输入邮箱地址"
                                type="email"
                            />
                        </el-form-item>

                        <el-form-item label="验证码" prop="code">
                            <div class="code-input-group">
                                <el-input
                                    v-model="form.code"
                                    placeholder="请输入验证码"
                                />
                                <el-button
                                    type="primary"
                                    :disabled="codeCooldown > 0 || !form.name || !form.email"
                                    :loading="sendingCode"
                                    @click="handleSendCode"
                                    class="send-code-btn"
                                >
                                    {{ codeCooldown > 0 ? `${codeCooldown}s` : '发送验证码' }}
                                </el-button>
                            </div>
                        </el-form-item>

                        <el-form-item label="密码" prop="password">
                            <el-input
                                v-model="form.password"
                                placeholder="请输入密码（至少6个字符）"
                                type="password"
                                show-password
                            />
                        </el-form-item>

                        <el-button
                            type="primary"
                            size="large"
                            class="submit-btn"
                            :loading="submitting"
                            @click="handleSubmit"
                        >
                            升级账号
                        </el-button>
                    </el-form>
                </div>
            </el-main>
        </el-scrollbar>
    </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { guestUpgradeApi, guestSendCodeApi } from '@/api/guest/guest.api'
import { UserStore } from '@/store/modules/user'
import { SidebarStore } from '@/store/modules/sidebar'
import QuestionHeader from '@/components/question-header'

const router = useRouter()
const userStore = UserStore()
const sidebarStore = SidebarStore()

function sidebar() {
    sidebarStore.toggle()
}

const formRef = ref<FormInstance>()
const submitting = ref(false)
const sendingCode = ref(false)
const codeCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const form = reactive({
    name: '',
    email: '',
    code: '',
    password: '',
})

const rules: FormRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 50, message: '用户名长度为1-50个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    ],
}

async function handleSendCode() {
    if (!form.name || !form.email) {
        ElMessage.warning('请先填写用户名和邮箱')
        return
    }

    sendingCode.value = true
    try {
        const res = await guestSendCodeApi({ name: form.name, email: form.email })
        if (res) {
            ElMessage.success('验证码已发送，请查收邮箱')
            startCooldown()
        }
    } catch (error: any) {
        handleError(error)
    } finally {
        sendingCode.value = false
    }
}

function startCooldown() {
    codeCooldown.value = 60
    cooldownTimer = setInterval(() => {
        codeCooldown.value--
        if (codeCooldown.value <= 0) {
            if (cooldownTimer) {
                clearInterval(cooldownTimer)
                cooldownTimer = null
            }
        }
    }, 1000)
}

async function handleSubmit() {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            const res = await guestUpgradeApi({
                name: form.name,
                email: form.email,
                code: form.code,
                password: form.password,
            })
            if (res) {
                // 更新 token 和用户信息
                userStore.setToken(res.token)
                await userStore.getUserInfo()
                ElMessage.success('升级成功！欢迎成为正式用户')
                router.push({ name: 'AskTeacher' })
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            submitting.value = false
        }
    })
}

function handleError(error: any) {
    const msg = error?.response?.data?.message || error?.message || ''
    if (msg.includes('用户名') && (msg.includes('已存在') || msg.includes('重复'))) {
        ElMessage.error('用户名已被占用，请更换')
    } else if (msg.includes('邮箱') && (msg.includes('已存在') || msg.includes('重复'))) {
        ElMessage.error('邮箱已被注册，请更换')
    } else if (msg.includes('验证码') && (msg.includes('错误') || msg.includes('无效'))) {
        ElMessage.error('验证码错误，请重新输入')
    } else if (msg.includes('校园网') || msg.includes('campus')) {
        ElMessage.error('请连接校园网后再试')
    } else if (msg) {
        ElMessage.error(msg)
    }
}
</script>

<style scoped lang="scss">
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header {
    height: 60px;
    padding: 0;
    border-bottom: 1px solid #ebeef5;
}

.main-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 20px;
}

.upgrade-card {
    width: 100%;
    max-width: 480px;
    padding: 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
        padding: 24px 16px;
    }

    .upgrade-header {
        text-align: center;
        margin-bottom: 32px;

        h2 {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }

        .upgrade-desc {
            font-size: 14px;
            color: #909399;
        }
    }

    .upgrade-form {
        .code-input-group {
            display: flex;
            gap: 10px;
            width: 100%;

            .el-input {
                flex: 1;
            }

            .send-code-btn {
                white-space: nowrap;
                min-width: 110px;
            }
        }

        .submit-btn {
            width: 100%;
            margin-top: 16px;
            height: 48px;
            font-size: 16px;
            border-radius: 8px;
        }
    }
}
</style>
