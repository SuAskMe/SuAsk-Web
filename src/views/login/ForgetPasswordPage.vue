<template>
    <el-dialog
        v-model="visible"
        :show-close="deviceTypeStore.isMobile"
        align-center
        width="400px"
        :fullscreen="deviceTypeStore.isMobile"
    >
        <div class="dialog">
            <div class="title">
                <p>忘记密码</p>
            </div>
            <div class="send-code">
                <el-input
                    v-model="mail"
                    style="height: 40px"
                    placeholder="请输入注册邮箱"
                >
                    <template #prefix>
                        <svg-icon icon="mail" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
                <div class="verification-code">
                    <el-input
                        v-model="code"
                        style="height: 40px"
                        placeholder="请输入验证码"
                        clearable
                    />
                    <el-button
                        @click="getCode"
                        type="primary"
                        style="height: 40px; width: 6rem"
                        :disabled="verifyStatus.disabled"
                        >{{
                            verifyStatus.disabled
                                ? verifyStatus.duration
                                : "获取验证码"
                        }}</el-button
                    >
                </div>
            </div>
            <div class="reset">
                <el-input
                    v-model="newPassword"
                    placeholder="请输入新密码"
                    style="height: 40px"
                    clearable
                    show-password
                >
                </el-input>
                <el-input
                    v-model="confirmPassword"
                    placeholder="请再次输入新密码"
                    style="height: 40px"
                    clearable
                    show-password
                >
                </el-input>
                <div class="button">
                    <el-button @click="resetPassword" type="primary"
                        >重置</el-button
                    >
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import {
    sendCodeApi,
    resetPasswordApi,
    forgetPasswordApi,
} from "@/api/user/reset_password.api";
import type { ResetPassword } from "@/model/user.model";
import { DeviceTypeStore } from "@/store/modules/device-type";
import { mailCheck } from "@/utils/login/register";
import { ElMessage } from "element-plus";
import { disabledTimeListsProps } from "element-plus/es/components/time-picker/src/props/shared.mjs";
import { reactive, ref } from "vue";

const deviceTypeStore = DeviceTypeStore();

const visible = defineModel("visible", {
    type: Boolean,
    default: false,
});

const mail = ref("");
const code = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const verifyStatus = reactive<{
    disabled: boolean;
    duration: number;
    timer: any;
}>({
    disabled: false,
    duration: 60,
    timer: null,
});
function getCode() {
    if (mail.value == "") {
        ElMessage.error("请输入注册邮箱");
        return;
    } else if (!mailCheck(mail.value)) {
        ElMessage.error("邮箱格式不正确");
        return;
    }
    sendCodeApi({ email: mail.value, type: "forget_password" })
        .then((res) => {
            if (res.msg === "200") {
                ElMessage.success("验证码已发送");
                verifyStatus.disabled = true;
                verifyStatus.timer && clearInterval(verifyStatus.timer);
                verifyStatus.timer = setInterval(() => {
                    verifyStatus.duration--;
                    if (verifyStatus.duration === 0) {
                        verifyStatus.disabled = false;
                        verifyStatus.duration = 60;
                        clearInterval(verifyStatus.timer);
                    }
                }, 1000);
                // console.log(res);
            } else {
                ElMessage.error(res.msg);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function resetPassword() {
    if (code.value == "") {
        ElMessage.error("请输入验证码");
        return;
    }
    if (newPassword.value == "") {
        ElMessage.error("请输入新密码");
        return;
    }
    if (confirmPassword.value == "") {
        ElMessage.error("请再次输入新密码");
        return;
    }
    if (newPassword.value != confirmPassword.value) {
        ElMessage.error("两次输入密码不一致");
        return;
    }
    const data: ResetPassword = {
        email: mail.value,
        code: code.value,
        password: newPassword.value,
    };
    forgetPasswordApi(data)
        .then((res) => {
            if (res) {
                ElMessage.success("重置成功");
                visible.value = false;
            } else {
                ElMessage.error("验证码错误");
                visible.value = false;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
</script>

<style scoped lang="scss">
.dialog {
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        margin-top: 25vh;
    }

    .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
    }

    .send-code {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .verification-code {
            display: flex;
            width: 100%;
            justify-content: space-between;
            gap: 10px;
        }
    }

    .reset {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;

        .button {
            width: 100%;
            display: flex;
            justify-content: end;

            .el-button {
                width: 40%;
                height: 30px;
                border-radius: 15px;
            }
        }
    }
}

:deep(.el-dialog__header) {
    padding: 0;
}
</style>
