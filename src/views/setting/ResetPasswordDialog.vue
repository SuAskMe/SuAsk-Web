<template>
    <div class="dialog">
        <el-dialog
            v-model="visible"
            :show-close="deviceTypeStore.isMobile"
            align-center
            width="450px"
            :fullscreen="deviceTypeStore.isMobile"
            class="password-dialog"
        >
            <div class="dialog-content">
                <div class="title">
                    <i class="el-icon-lock dialog-icon"></i>
                    <h2>重置密码</h2>
                </div>

                <div class="send-code">
                    <div class="form-field">
                        <label>邮箱</label>
                        <el-input
                            v-model="mail"
                            style="height: 45px"
                            placeholder="请输入注册邮箱"
                            disabled
                        >
                            <template #prefix>
                                <svg-icon icon="mail" color="#71B6FF" size="20px" />
                            </template>
                        </el-input>
                    </div>

                    <div class="form-field">
                        <label>验证码</label>
                        <div class="verification-code">
                            <el-input
                                v-model="code"
                                style="height: 45px"
                                placeholder="请输入验证码"
                                clearable
                            />
                            <el-button
                                @click="getCode"
                                type="primary"
                                style="height: 45px; width: 7rem"
                                :disabled="verifyStatus.disabled"
                                class="code-button"
                                >{{
                                    verifyStatus.disabled
                                        ? `${verifyStatus.duration}s`
                                        : '获取验证码'
                                }}</el-button
                            >
                        </div>
                    </div>
                </div>

                <div class="reset">
                    <div class="form-field">
                        <label>新密码</label>
                        <el-input
                            v-model="newPassword"
                            placeholder="请输入新密码"
                            style="height: 45px"
                            clearable
                            show-password
                        >
                        </el-input>
                    </div>

                    <div class="form-field">
                        <label>确认密码</label>
                        <el-input
                            v-model="confirmPassword"
                            placeholder="请再次输入新密码"
                            style="height: 45px"
                            clearable
                            show-password
                        >
                        </el-input>
                    </div>

                    <div class="button">
                        <el-button @click="visible = false" type="default">取消</el-button>
                        <el-button @click="resetPassword" type="primary">重置密码</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { resetPasswordApi, sendCodeApi } from '@/api/user/reset_password.api'
import type { ResetPassword } from '@/model/user.model'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { UserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

const visible = defineModel('visible', { type: Boolean, default: true })

const deviceTypeStore = DeviceTypeStore()

const userStore = UserStore()

const mail = computed(() => userStore.getUser().email)
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
    sendCodeApi({ email: mail.value, type: 'reset_password' })
        .then((res) => {
            if (res.msg === '200') {
                ElMessage.success('验证码已发送')
                // console.log(res);
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
    resetPasswordApi(data)
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
.dialog {
    .dialog-content {
        @media (max-width: 768px) {
            margin-top: 20vh;
        }

        .title {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;

            .dialog-icon {
                font-size: 24px;
                margin-right: 10px;
                color: $su-blue;
            }

            h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
                color: #333;
            }
        }

        .form-field {
            margin-bottom: 1.25rem;

            label {
                display: block;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                color: #606266;
                font-weight: 500;
            }
        }

        .send-code {
            .verification-code {
                display: flex;
                width: 100%;
                gap: 10px;

                .code-button {
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
            }
        }

        .reset {
            .button {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                margin-top: 2rem;

                .el-button {
                    min-width: 100px;
                    height: 40px;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;

                    &:hover {
                        transform: translateY(-2px);
                    }
                }
            }
        }
    }
}

:deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

    @media (max-width: 768px) {
        border-radius: 0;
    }
}

:deep(.el-dialog__header) {
    padding: 0;
}

:deep(.el-dialog__body) {
    padding: 25px 30px;
}

:deep(.el-input__wrapper) {
    border-radius: 8px;
}
</style>
