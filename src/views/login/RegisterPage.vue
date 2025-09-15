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
                    <h2 class="title">{{ isBasicInfo ? '注册账号' : '创建密码' }}</h2>
                    <div class="title-underline"></div>
                </div>

                <div class="steps">
                    <div class="step" :class="{ active: isBasicInfo, completed: !isBasicInfo }">
                        1
                    </div>
                    <div class="step-line"></div>
                    <div class="step" :class="{ active: isPassword }">2</div>
                </div>

                <transition name="fade-transform" mode="out-in">
                    <div v-if="isBasicInfo" class="form-container" key="basic-info">
                        <el-input
                            v-model="registerForm.userName"
                            class="custom-input"
                            placeholder="请输入注册用户名"
                            clearable
                        >
                            <template #prefix>
                                <el-icon color="#71B6FF" size="20px"><User /></el-icon>
                            </template>
                        </el-input>
                        <el-input
                            v-model="registerForm.mail"
                            class="custom-input"
                            placeholder="请输入注册邮箱"
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
                                >{{
                                    verifyStatus.disabled
                                        ? verifyStatus.duration + 's'
                                        : '获取验证码'
                                }}</el-button
                            >
                        </div>
                        <div class="button-container">
                            <el-button @click="next_step" type="primary" class="submit-btn"
                                >下一步</el-button
                            >
                        </div>
                    </div>
                    <div v-else class="form-container" key="password">
                        <el-input
                            v-model="registerForm.newPassword"
                            placeholder="请输入新密码"
                            class="custom-input"
                            clearable
                            show-password
                        >
                            <template #prefix>
                                <el-icon color="#71B6FF" size="20px"><Lock /></el-icon>
                            </template>
                        </el-input>
                        <el-input
                            v-model="registerForm.confirmPassword"
                            placeholder="请再次输入新密码"
                            class="custom-input"
                            clearable
                            show-password
                        >
                            <template #prefix>
                                <el-icon color="#71B6FF" size="20px"><Lock /></el-icon>
                            </template>
                        </el-input>
                        <div class="button-container">
                            <el-button @click="register" type="primary" class="submit-btn"
                                >完成注册</el-button
                            >
                        </div>
                    </div>
                </transition>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    registerApi,
    sendVerificationCodeApi,
    verifyVerificationCodeApi,
} from '@/api/user/register.api'
import type { RegisterReq } from '@/model/register.model'
import { router } from '@/router'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { mailCheck, passwordCheck, userNameCheck } from '@/utils/login/register'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const deviceTypeStore = DeviceTypeStore()

const visible = defineModel('visible', {
    type: Boolean,
    default: false,
})

export interface Register {
    userName: string
    mail: string
    verificationCode: string
    newPassword: string
    confirmPassword: string
}

const registerForm = ref<Register>({
    userName: '',
    mail: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
})

const isBasicInfo = ref(true)
const isPassword = ref(false)

function closed() {
    isBasicInfo.value = true
    isPassword.value = false
    registerForm.value = {
        userName: '',
        mail: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
    }
}

async function next_step() {
    if (
        registerForm.value.userName == '' ||
        registerForm.value.mail == '' ||
        registerForm.value.verificationCode == ''
    ) {
        ElMessage.error('请填写完整信息')
        return
    } else if (!userNameCheck(registerForm.value.userName)) {
        ElMessage.error('用户名格式错误, 只能包含字母、数字、下划线、中划线')
        return
    } else if (!mailCheck(registerForm.value.mail)) {
        ElMessage.error('邮箱格式错误')
        return
    } else {
        await verifyVerificationCodeApi({
            email: registerForm.value.mail,
            code: registerForm.value.verificationCode,
        }).then((res) => {
            if (res instanceof String) {
                return
            } else {
                // console.log(res);
                localStorage.setItem('verificationToken', res.token)
                ElMessage.success('验证成功')
                isBasicInfo.value = false
                isPassword.value = true
            }
        })
    }
}

async function register() {
    if (registerForm.value.newPassword == '' || registerForm.value.confirmPassword == '') {
        ElMessage.error('请填写完整密码')
        return
    } else if (!passwordCheck(registerForm.value.newPassword, registerForm.value.confirmPassword)) {
        ElMessage.error('两次输入的密码不一致')
        return
    } else {
        const registerData: RegisterReq = {
            name: registerForm.value.userName,
            password: registerForm.value.confirmPassword,
            email: registerForm.value.mail,
            token: localStorage.getItem('verificationToken') || '',
        }
        await registerApi(registerData).then((res) => {
            if (res instanceof String) {
                return
            } else {
                // console.log(res);
                ElMessage.success('注册成功')
                router.push('/login')
                window.location.reload()
            }
        })
    }
}

const verifyStatus = reactive<{
    disabled: boolean
    duration: number
    timer: number | undefined
}>({
    disabled: false,
    duration: 60,
    timer: undefined,
})

async function getVerificationCode() {
    if (registerForm.value.userName == '') {
        ElMessage.error('请填写用户名')
        return
    } else if (!userNameCheck(registerForm.value.userName)) {
        ElMessage.error('用户名格式错误, 只能包含字母、数字、下划线、中划线')
        return
    } else if (registerForm.value.mail == '') {
        ElMessage.error('请填写邮箱')
        return
    } else if (!mailCheck(registerForm.value.mail)) {
        ElMessage.error('邮箱格式错误')
        return
    }
    await sendVerificationCodeApi({
        email: registerForm.value.mail,
        name: registerForm.value.userName,
    }).then((res) => {
        // console.log(res);
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
            // console.log(res);
            ElMessage.error(res.msg)
        }
    })
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
        margin-top: 15vh;
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
            transition: all 0.3s ease;
        }

        .title-underline {
            height: 3px;
            width: 60px;
            margin: 0 auto;
            background: linear-gradient(to right, #71b6ff, #4891e0);
            border-radius: 3px;
        }
    }

    .steps {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 25px;

        .step {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #e0e0e0;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.3s ease;

            &.active {
                background-color: #71b6ff;
                transform: scale(1.1);
                box-shadow: 0 0 10px rgba(113, 182, 255, 0.5);
            }

            &.completed {
                background-color: #67c23a;
            }
        }

        .step-line {
            width: 80px;
            height: 2px;
            background-color: #e0e0e0;
            margin: 0 10px;
        }
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .custom-input {
            height: 46px;
            border-radius: 8px;
            transition: all 0.3s ease;

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
                height: 46px;
                min-width: 110px;
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
        }

        .button-container {
            margin-top: 8px;

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

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
    transition: all 0.4s ease;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
