<template>
    <div>
        <el-dialog
            v-model="visible"
            width="450px"
            align-center
            @closed="closed"
            :show-close="deviceTypeStore.isMobile"
            :fullscreen="deviceTypeStore.isMobile"
            class="register-dialog"
        >
            <div class="dialog-card">
                <div class="title-container">
                    <h2 class="title">注册账号</h2>
                    <div class="title-underline"></div>
                </div>

                <div class="form-container">
                    <el-input
                        v-model="registerForm.userName"
                        class="custom-input"
                        placeholder="请输入用户名"
                        clearable
                    >
                        <template #prefix>
                            <el-icon color="#71B6FF" size="20px">
                                <component :is="User" />
                            </el-icon>
                        </template>
                    </el-input>

                    <el-input
                        v-model="registerForm.mail"
                        class="custom-input"
                        placeholder="请输入邮箱（用于通知和找回密码）"
                        clearable
                    >
                        <template #prefix>
                            <svg-icon icon="mail" color="#71B6FF" size="20px" />
                        </template>
                    </el-input>

                    <div class="verification-code">
                        <el-input
                            v-model="registerForm.verificationCode"
                            class="custom-input verification-input"
                            placeholder="请输入验证码"
                            clearable
                        />
                        <el-button
                            @click="getVerificationCode"
                            type="primary"
                            class="code-btn"
                            :disabled="verifyStatus.disabled"
                        >
                            {{ verifyStatus.disabled ? verifyStatus.duration + 's' : '获取验证码' }}
                        </el-button>
                    </div>

                    <el-input
                        v-model="registerForm.newPassword"
                        placeholder="请输入密码"
                        class="custom-input"
                        clearable
                        show-password
                    >
                        <template #prefix>
                            <el-icon color="#71B6FF" size="20px">
                                <component :is="Lock" />
                            </el-icon>
                        </template>
                    </el-input>

                    <el-input
                        v-model="registerForm.confirmPassword"
                        placeholder="请再次输入密码"
                        class="custom-input"
                        clearable
                        show-password
                    >
                        <template #prefix>
                            <el-icon color="#71B6FF" size="20px">
                                <component :is="Lock" />
                            </el-icon>
                        </template>
                    </el-input>

                    <div class="button-container">
                        <el-button
                            @click="register"
                            type="primary"
                            class="submit-btn"
                            :loading="registering"
                        >
                            完成注册
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { registerApi, sendVerificationCodeApi, type RegisterReq } from '@/entities/register'
import { router } from '@/app/router'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { mailCheck, passwordCheck, userNameCheck } from '@/shared/lib/account-validation'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElDialog } from 'element-plus/es/components/dialog/index.mjs'
import 'element-plus/es/components/dialog/style/css'
import { reactive, ref } from 'vue'

const deviceTypeStore = DeviceTypeStore()

const visible = defineModel('visible', {
    type: Boolean,
    default: false,
})

const registerForm = ref({
    userName: '',
    mail: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
})

const registering = ref(false)

function closed() {
    registerForm.value = {
        userName: '',
        mail: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
    }
}

const verifyStatus = reactive<{
    disabled: boolean
    duration: number
    timer: ReturnType<typeof setInterval> | undefined
}>({
    disabled: false,
    duration: 60,
    timer: undefined,
})

async function getVerificationCode() {
    if (registerForm.value.userName === '') {
        ElMessage.error('请填写用户名')
        return
    }
    if (!userNameCheck(registerForm.value.userName)) {
        ElMessage.error('用户名格式错误，只能包含字母、数字、下划线、中划线')
        return
    }
    if (registerForm.value.mail === '') {
        ElMessage.error('请填写邮箱')
        return
    }
    if (!mailCheck(registerForm.value.mail)) {
        ElMessage.error('邮箱格式错误')
        return
    }
    await sendVerificationCodeApi({
        email: registerForm.value.mail,
        name: registerForm.value.userName,
    }).then((res) => {
        if (res.msg === '200') {
            ElMessage.success('验证码发送成功')
            verifyStatus.disabled = true
            if (verifyStatus.timer) clearInterval(verifyStatus.timer)
            verifyStatus.timer = setInterval(() => {
                verifyStatus.duration--
                if (verifyStatus.duration === 0) {
                    verifyStatus.disabled = false
                    verifyStatus.duration = 60
                    clearInterval(verifyStatus.timer)
                }
            }, 1000)
        } else {
            ElMessage.error(res.msg)
        }
    })
}

async function register() {
    if (registerForm.value.userName === '' || registerForm.value.mail === '') {
        ElMessage.error('请填写完整信息')
        return
    }
    if (!userNameCheck(registerForm.value.userName)) {
        ElMessage.error('用户名格式错误，只能包含字母、数字、下划线、中划线')
        return
    }
    if (!mailCheck(registerForm.value.mail)) {
        ElMessage.error('邮箱格式错误')
        return
    }
    if (registerForm.value.verificationCode === '') {
        ElMessage.error('请输入验证码')
        return
    }
    if (registerForm.value.newPassword === '' || registerForm.value.confirmPassword === '') {
        ElMessage.error('请填写完整密码')
        return
    }
    if (!passwordCheck(registerForm.value.newPassword, registerForm.value.confirmPassword)) {
        ElMessage.error('两次输入的密码不一致')
        return
    }

    registering.value = true
    try {
        const registerData: RegisterReq = {
            name: registerForm.value.userName,
            password: registerForm.value.confirmPassword,
            email: registerForm.value.mail,
            code: registerForm.value.verificationCode,
        }
        const res = await registerApi(registerData)
        if (res) {
            ElMessage.success('注册成功')
            router.push('/login')
            window.location.reload()
        }
    } finally {
        registering.value = false
    }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__header) {
    padding: 0;
}

:deep(.el-dialog__body) {
    padding: 0;
}

:deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;

    @media screen and (max-width: 768px) {
        border-radius: 0;
    }
}

.dialog-card {
    display: flex;
    flex-direction: column;
    padding: 30px 25px;
    background: linear-gradient(to bottom, #f8faff, #ffffff);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    @media (max-width: 768px) {
        margin-top: 10vh;
        padding: 25px 20px;
    }

    .title-container {
        text-align: center;
        margin-bottom: 20px;

        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        }

        .title-underline {
            height: 3px;
            width: 60px;
            margin: 0 auto;
            background: linear-gradient(to right, #71b6ff, #4891e0);
            border-radius: 3px;
        }
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .custom-input {
            height: 44px;
            border-radius: 8px;

            :deep(.el-input__wrapper) {
                border-radius: 8px;
                box-shadow: 0 0 0 1px rgba(113, 182, 255, 0.2);

                &:hover,
                &:focus {
                    box-shadow: 0 0 0 1px rgba(113, 182, 255, 0.4);
                }
            }
        }

        .verification-code {
            display: flex;
            width: 100%;
            gap: 10px;

            .verification-input {
                flex: 1;
            }

            .code-btn {
                height: 44px;
                min-width: 110px;
                border-radius: 8px;
                font-weight: 500;
            }
        }

        .button-container {
            margin-top: 6px;

            .submit-btn {
                width: 100%;
                height: 46px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                background: linear-gradient(to right, #71b6ff, #4891e0);
                border: none;
                box-shadow: 0 4px 10px rgba(113, 182, 255, 0.3);
                transition: all 0.3s ease;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(113, 182, 255, 0.4);
                }

                &:active {
                    transform: translateY(0);
                }
            }
        }
    }
}
</style>
