<template>
    <el-dialog
        v-model="visible"
        width="400px"
        align-center
        @closed="closed"
        :show-close="deviceTypeStore.isMobile"
        :fullscreen="deviceTypeStore.isMobile"
    >
        <div class="dialog">
            <div v-if="isBasicInfo" class="modal">
                <p>注册账号</p>
                <el-input
                    v-model="registerForm.userName"
                    style="height: 40px"
                    placeholder="请输入注册用户名"
                    clearable
                >
                    <template #prefix>
                        <svg-icon icon="user" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
                <el-input
                    v-model="registerForm.mail"
                    style="height: 40px"
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
                        style="height: 40px"
                        placeholder="请输入验证码"
                        clearable
                    />
                    <el-button
                        @click="getVerificationCode"
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
                <div class="button">
                    <el-button @click="next_step" type="primary"
                        >下一步</el-button
                    >
                </div>
            </div>
            <div v-if="isPassword" class="modal">
                <p>创建密码</p>
                <el-input
                    v-model="registerForm.newPassword"
                    placeholder="请输入新密码"
                    style="height: 40px"
                    clearable
                    show-password
                >
                    <template #prefix>
                        <svg-icon icon="key" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
                <el-input
                    v-model="registerForm.confirmPassword"
                    placeholder="请再次输入新密码"
                    style="height: 40px"
                    clearable
                    show-password
                >
                    <template #prefix>
                        <svg-icon icon="key" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
                <div class="button">
                    <el-button @click="register" type="primary">注册</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import {
    registerApi,
    sendVerificationCodeApi,
    verifyVerificationCodeApi,
} from "@/api/user/register.api";
import type { RegisterReq } from "@/model/register.model";
import { router } from "@/router";
import { DeviceTypeStore } from "@/store/modules/device-type";
import {
    mailCheck,
    passwordCheck,
    userNameCheck,
} from "@/utils/login/register";
import { ElMessage } from "element-plus";
import { disabledTimeListsProps } from "element-plus/es/components/time-picker/src/props/shared.mjs";
import { reactive, ref } from "vue";

const deviceTypeStore = DeviceTypeStore();

const visible = defineModel("visible", {
    type: Boolean,
    default: false,
});

export interface Register {
    userName: string;
    mail: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
}

const registerForm = ref<Register>({
    userName: "",
    mail: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
});

const isBasicInfo = ref(true);
const isPassword = ref(false);

function closed() {
    isBasicInfo.value = true;
    isPassword.value = false;
    registerForm.value = {
        userName: "",
        mail: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
    };
}

async function next_step() {
    if (
        registerForm.value.userName == "" ||
        registerForm.value.mail == "" ||
        registerForm.value.verificationCode == ""
    ) {
        ElMessage.error("请填写完整信息");
        return;
    } else if (!userNameCheck(registerForm.value.userName)) {
        ElMessage.error("用户名格式错误, 只能包含字母、数字、下划线、中划线");
        return;
    } else if (!mailCheck(registerForm.value.mail)) {
        ElMessage.error("邮箱格式错误");
        return;
    } else {
        await verifyVerificationCodeApi({
            email: registerForm.value.mail,
            code: registerForm.value.verificationCode,
        }).then((res) => {
            if (res instanceof String) {
                return;
            } else {
                // console.log(res);
                localStorage.setItem("verificationToken", res.token);
                ElMessage.success("验证成功");
                isBasicInfo.value = false;
                isPassword.value = true;
            }
        });
    }
}

async function register() {
    if (
        registerForm.value.newPassword == "" ||
        registerForm.value.confirmPassword == ""
    ) {
        ElMessage.error("请填写完整密码");
        return;
    } else if (
        !passwordCheck(
            registerForm.value.newPassword,
            registerForm.value.confirmPassword
        )
    ) {
        ElMessage.error("两次输入的密码不一致");
        return;
    } else {
        const registerData: RegisterReq = {
            name: registerForm.value.userName,
            password: registerForm.value.confirmPassword,
            email: registerForm.value.mail,
            token: localStorage.getItem("verificationToken") || "",
        };
        await registerApi(registerData).then((res) => {
            if (res instanceof String) {
                return;
            } else {
                // console.log(res);
                ElMessage.success("注册成功");
                router.push("/login");
                window.location.reload();
            }
        });
    }
}

const verifyStatus = reactive<{
    disabled: boolean;
    duration: number;
    timer: any;
}>({
    disabled: false,
    duration: 60,
    timer: null,
});

async function getVerificationCode() {
    if (registerForm.value.userName == "") {
        ElMessage.error("请填写用户名");
        return;
    } else if (!userNameCheck(registerForm.value.userName)) {
        ElMessage.error("用户名格式错误, 只能包含字母、数字、下划线、中划线");
        return;
    } else if (registerForm.value.mail == "") {
        ElMessage.error("请填写邮箱");
        return;
    } else if (!mailCheck(registerForm.value.mail)) {
        ElMessage.error("邮箱格式错误");
        return;
    }
    await sendVerificationCodeApi({
        email: registerForm.value.mail,
        name: registerForm.value.userName,
    }).then((res) => {
        // console.log(res);
        if (res.msg === "200") {
            ElMessage.success("验证码发送成功");
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
        } else {
            // console.log(res);
            ElMessage.error(res.msg);
        }
    });
}
</script>

<style scoped lang="scss">
.dialog {
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        margin-top: 25vh;
    }

    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        p {
            font-size: 20px;
            font-weight: bold;
        }

        .verification-code {
            display: flex;
            width: 100%;
            justify-content: space-between;
            gap: 20px;
        }

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
</style>
