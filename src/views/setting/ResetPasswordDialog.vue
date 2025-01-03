<template>
    <div class="dialog">
        <el-dialog v-model="visible" :show-close="false" align-center width="300px">
            <div class="title">重置密码</div>
            <div class="send-code">
                <el-input v-model="mail" style="height: 40px;" placeholder="请输入注册邮箱" disabled>
                    <template #prefix>
                        <svg-icon icon="mail" color="#71B6FF" size="20px" />
                    </template>
                </el-input>
                <div class="verification-code">
                    <el-input v-model="code" style="height: 40px;" placeholder="请输入验证码" clearable />
                    <el-button @click="getCode" type="primary" style="height: 40px;">获取验证码</el-button>
                </div>
            </div>
            <div class="reset">
                <el-input v-model="newPassword" placeholder="请输入新密码" style="height: 40px;" clearable show-password>
                </el-input>
                <el-input v-model="confirmPassword" placeholder="请再次输入新密码" style="height: 40px;" clearable
                    show-password>
                </el-input>
                <div class="button">
                    <el-button @click="resetPassword" type="primary">重置</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { resetPasswordApi, sendCodeApi } from '@/api/user/reset_password.api';
import type { ResetPassword, User } from '@/model/user.model';
import { getUserInfo } from '@/utils/userInfo';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const visible = defineModel("visible", { type: Boolean, default: true });

const mail = ref(getUserInfo().email);
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

function getCode() {
    sendCodeApi({ email: mail.value, type: 'reset_password' }).then(res => {
        if (res) {
            ElMessage.success('验证码已发送');
            console.log(res);
        } else {
            ElMessage.error('验证码发送失败');
        }
    }).catch(err => {
        console.log(err);
    })
}

function resetPassword() {
    if (code.value == '') {
        ElMessage.error('请输入验证码');
        return;
    }
    if (newPassword.value == '') {
        ElMessage.error('请输入新密码');
        return;
    }
    if (confirmPassword.value == '') {
        ElMessage.error('请再次输入新密码');
        return;
    }
    if (newPassword.value != confirmPassword.value) {
        ElMessage.error('两次输入密码不一致');
        return;
    }
    const data: ResetPassword = {
        email: mail.value,
        code: code.value,
        password: newPassword.value
    }
    resetPasswordApi(data).then(res => {
        if (res) {
            ElMessage.success('重置成功');
            visible.value = false;
        } else {
            ElMessage.error('验证码错误');
            visible.value = false;
        }
    }).catch(err => {
        console.log(err);
    })
}
</script>

<style scoped lang="scss">
.dialog {
    display: flex;
    flex-direction: column;

    .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
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

:deep(.el-dialog) {
    border-radius: 20px;
}

:deep(.el-dialog__header) {
    padding: 0;
}
</style>