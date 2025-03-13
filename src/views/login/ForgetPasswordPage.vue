<template>
    <div>
        <el-dialog
            v-model="visible"
            :show-close="deviceTypeStore.isMobile"
            align-center
            width="450px"
            :fullscreen="deviceTypeStore.isMobile"
            :close-on-click-modal="false"
            class="forget-dialog"
        >
            <div class="dialog-card">
                <div class="title-container">
                    <h2 class="title">忘记密码</h2>
                    <div class="title-underline"></div>
                </div>
                <div class="send-code">
                    <el-input v-model="mail" class="custom-input" placeholder="请输入注册邮箱">
                        <template #prefix>
                            <svg-icon icon="mail" color="#71B6FF" size="20px" />
                        </template>
                    </el-input>
                    <div class="verification-code">
                        <el-input
                            v-model="code"
                            class="custom-input"
                            placeholder="请输入验证码"
                            clearable
                        />
                        <el-button
                            @click="getCode"
                            type="primary"
                            class="code-btn"
                            :disabled="verifyStatus.disabled"
                            >{{
                                verifyStatus.disabled ? verifyStatus.duration + 's' : '获取验证码'
                            }}</el-button
                        >
                    </div>
                </div>
                <div class="reset">
                    <el-input
                        v-model="newPassword"
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
                        v-model="confirmPassword"
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
                        <el-button @click="resetPassword" type="primary" class="submit-btn"
                            >重置密码</el-button
                        >
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { sendCodeApi, forgetPasswordApi } from '@/api/user/reset_password.api'
import type { ResetPassword } from '@/model/user.model'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { mailCheck } from '@/utils/login/register'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const deviceTypeStore = DeviceTypeStore()

const visible = defineModel('visible', {
    type: Boolean,
    default: false,
})

const mail = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const verifyStatus = reactive<{
    disabled: boolean
    duration: number
    timer: any
}>({
    disabled: false,
    duration: 60,
    timer: null,
})
function getCode() {
    if (mail.value == '') {
        ElMessage.error('请输入注册邮箱')
        return
    } else if (!mailCheck(mail.value)) {
        ElMessage.error('邮箱格式不正确')
        return
    }
    sendCodeApi({ email: mail.value, type: 'forget_password' })
        .then((res) => {
            if (res.msg === '200') {
                ElMessage.success('验证码已发送')
                verifyStatus.disabled = true
                verifyStatus.timer && clearInterval(verifyStatus.timer)
                verifyStatus.timer = setInterval(() => {
                    verifyStatus.duration--
                    if (verifyStatus.duration === 0) {
                        verifyStatus.disabled = false
                        verifyStatus.duration = 60
                        clearInterval(verifyStatus.timer)
                    }
                }, 1000)
                // console.log(res);
            } else {
                ElMessage.error(res.msg)
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

function resetPassword() {
    if (code.value == '') {
        ElMessage.error('请输入验证码')
        return
    }
    if (newPassword.value == '') {
        ElMessage.error('请输入新密码')
        return
    }
    if (confirmPassword.value == '') {
        ElMessage.error('请再次输入新密码')
        return
    }
    if (newPassword.value != confirmPassword.value) {
        ElMessage.error('两次输入密码不一致')
        return
    }
    const data: ResetPassword = {
        email: mail.value,
        code: code.value,
        password: newPassword.value,
    }
    forgetPasswordApi(data)
        .then((res) => {
            if (res) {
                ElMessage.success('重置成功')
                visible.value = false
            } else {
                ElMessage.error('验证码错误')
                visible.value = false
            }
        })
        .catch((err) => {
            console.log(err)
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
        margin-bottom: 30px;

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

    .custom-input {
        height: 46px;
        margin-bottom: 16px;
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

    .send-code {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;

        .verification-code {
            display: flex;
            width: 100%;
            justify-content: space-between;
            gap: 10px;

            .code-btn {
                height: 46px;
                min-width: 110px;
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
        }
    }

    .reset {
        display: flex;
        flex-direction: column;

        .button-container {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 10px;

            .submit-btn {
                width: 100%;
                height: 46px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                margin-top: 10px;
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
