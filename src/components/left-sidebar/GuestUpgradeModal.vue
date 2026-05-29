<template>
    <Teleport to="body">
        <Transition name="upgrade-fade">
            <div v-if="modelValue" class="upgrade-overlay" @click.self="closeModal">
                <div class="upgrade-modal">
                    <div class="dialog-card">
                        <div class="title-container">
                            <h2 class="title">升级正式账号</h2>
                            <div class="title-underline"></div>
                        </div>

                        <div class="form-container">
                            <el-input
                                v-model="upgradeForm.name"
                                class="custom-input"
                                placeholder="请输入用户名"
                                maxlength="50"
                                clearable
                            >
                                <template #prefix>
                                    <el-icon color="#71B6FF" size="20px"><User /></el-icon>
                                </template>
                            </el-input>

                            <el-input
                                v-model="upgradeForm.email"
                                class="custom-input"
                                placeholder="请输入邮箱"
                                clearable
                            >
                                <template #prefix>
                                    <svg-icon icon="mail" color="#71B6FF" size="20px" />
                                </template>
                            </el-input>

                            <div class="verification-code">
                                <el-input
                                    v-model="upgradeForm.code"
                                    class="custom-input verification-input"
                                    placeholder="请输入验证码"
                                    clearable
                                />
                                <el-button
                                    type="primary"
                                    class="code-btn"
                                    :disabled="
                                        codeCooldown > 0 ||
                                        !upgradeForm.name ||
                                        !upgradeForm.email ||
                                        sendingCode
                                    "
                                    @click="handleSendCode"
                                >
                                    {{ codeCooldown > 0 ? codeCooldown + 's' : '获取验证码' }}
                                </el-button>
                            </div>

                            <el-input
                                v-model="upgradeForm.password"
                                placeholder="请输入密码（至少6位）"
                                class="custom-input"
                                clearable
                                show-password
                            >
                                <template #prefix>
                                    <el-icon color="#71B6FF" size="20px"><Lock /></el-icon>
                                </template>
                            </el-input>

                            <div class="button-container">
                                <el-button
                                    type="primary"
                                    class="submit-btn"
                                    :loading="upgradeSubmitting"
                                    @click="handleUpgrade"
                                >
                                    升级账号
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { Lock, User } from '@element-plus/icons-vue'
import { guestSendCodeApi, guestUpgradeApi } from '@/api/guest/guest.api'
import { UserStore } from '@/store/modules/user'

defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'upgraded'])

const userStore = UserStore()

const upgradeSubmitting = ref(false)
const sendingCode = ref(false)
const codeCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const upgradeForm = reactive({
    name: '',
    email: '',
    code: '',
    password: '',
})

function closeModal() {
    emit('update:modelValue', false)
}

async function handleSendCode() {
    if (!upgradeForm.name || !upgradeForm.email) {
        return
    }
    sendingCode.value = true
    try {
        const res = await guestSendCodeApi({ name: upgradeForm.name, email: upgradeForm.email })
        if (res && res.msg === '200') {
            ElMessage.success('验证码已发送')
            codeCooldown.value = 60
            cooldownTimer = setInterval(() => {
                codeCooldown.value--
                if (codeCooldown.value <= 0 && cooldownTimer) {
                    clearInterval(cooldownTimer)
                    cooldownTimer = null
                }
            }, 1000)
        } else if (res) {
            ElMessage.warning(res.msg)
        }
    } catch {
        // 统一由请求拦截器提示错误，这里只负责结束发送态。
    } finally {
        sendingCode.value = false
    }
}

async function handleUpgrade() {
    if (!upgradeForm.name) {
        ElMessage.error('请输入用户名')
        return
    }
    if (!upgradeForm.email) {
        ElMessage.error('请输入邮箱')
        return
    }
    if (!upgradeForm.code) {
        ElMessage.error('请输入验证码')
        return
    }
    if (!upgradeForm.password || upgradeForm.password.length < 6) {
        ElMessage.error('密码至少6个字符')
        return
    }

    upgradeSubmitting.value = true
    try {
        const res = await guestUpgradeApi({
            name: upgradeForm.name,
            email: upgradeForm.email,
            code: upgradeForm.code,
            password: upgradeForm.password,
        })
        if (res) {
            userStore.setToken(res.token)
            await userStore.getUserInfo()
            closeModal()
            emit('upgraded')
            ElMessage.success('升级成功！')
        }
    } catch {
        // 统一由请求拦截器提示错误，这里不重复弹提示。
    } finally {
        upgradeSubmitting.value = false
    }
}

onUnmounted(() => {
    // 冷却计时器必须在组件销毁时清掉，否则重新打开弹窗会出现倒计时串台。
    if (cooldownTimer) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
    }
})
</script>

<style scoped lang="scss">
.upgrade-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3000;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.upgrade-modal {
    width: 420px;
    max-width: 90vw;
    border-radius: 12px;
    overflow: hidden;
    animation: modal-in 0.25s ease;

    @media (max-width: 768px) {
        width: 92vw;
    }
}

.dialog-card {
    display: flex;
    flex-direction: column;
    padding: 30px 25px;
    background: linear-gradient(to bottom, #f8faff, #ffffff);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.title-container {
    text-align: center;
    margin-bottom: 20px;
}

.title {
    font-size: 22px;
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

.form-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

:deep(.custom-input) {
    height: 44px;

    .el-input__wrapper {
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(113, 182, 255, 0.2);

        &:hover,
        &.is-focus {
            box-shadow: 0 0 0 1px rgba(113, 182, 255, 0.4);
        }
    }
}

.verification-code {
    display: flex;
    width: 100%;
    gap: 10px;
}

.verification-input {
    flex: 1;
}

.code-btn {
    height: 44px;
    min-width: 110px;
    border-radius: 8px;
    font-weight: 500;
}

.button-container {
    margin-top: 6px;
}

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

@keyframes modal-in {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.upgrade-fade-enter-active,
.upgrade-fade-leave-active {
    transition: opacity 0.25s ease;
}

.upgrade-fade-enter-from,
.upgrade-fade-leave-to {
    opacity: 0;
}
</style>
