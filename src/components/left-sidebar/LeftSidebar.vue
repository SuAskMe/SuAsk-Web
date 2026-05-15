<template>
    <div class="sidebar">
        <div class="title">
            <div class="message">
                <svg-icon
                    @click="openDrawer"
                    class="message-icon"
                    icon="message-1"
                    color="#71B6FF"
                    size="24px"
                />
                <div v-if="newQuestionCount + newAnswerCount + newReplyCount > 0" class="red-dot" />
            </div>
            <svg-icon
                v-if="deviceTypeStore.isMobile"
                @click="toggleSidebar"
                class="sidebar-btn"
                icon="sidebar"
                color="#71B6FF"
                size="24px"
                :filled="sidebarStore.IsOpen"
            />
        </div>
        <div class="avatar-and-id" @click="navigateToUserInfo">
            <UserAvatar :src="userInfo.avatar" :name="userInfo.nickname" :size="120" />
            <div class="user-name">
                <span>{{ userInfo.nickname }}</span>
            </div>
            <div class="user-id">
                <span>@{{ userInfo.name }}</span>
            </div>
        </div>
        <div v-if="role == 'guest'" class="guest-login-hint">
            <div class="guest-login-btn" @click="showUpgradeDialog = true">
                <svg-icon icon="arrow-left" color="#71B6FF" size="14px" style="transform: rotate(180deg); margin-right: 6px;" />
                <span>登录以获取全部功能</span>
            </div>
        </div>
        <div class="control-panel">
            <student-item v-if="role == 'student'" />
            <teacher-item v-else-if="role == 'teacher'" />
            <admin-item v-else-if="role == 'admin'" />
            <guest-item v-else-if="role == 'guest'" />
        </div>
    </div>

    <Teleport to="body">
        <Transition name="drawer-fade">
            <div v-if="drawer" class="custom-drawer-container" @click.self="closeDrawer"></div>
        </Transition>
        <Transition name="drawer-slide">
            <div
                v-if="drawer"
                class="custom-drawer"
                :style="{
                    width: deviceTypeStore.isMobile ? '100%' : '400px',
                }"
            >
                <NotificationDialog
                    @close-drawer="closeDrawer"
                    :question-count="newQuestionCount"
                    :answer-count="newAnswerCount"
                    :reply-count="newReplyCount"
                    :user_id="userInfo.id"
                ></NotificationDialog>
            </div>
        </Transition>
    </Teleport>

    <!-- Guest 升级弹窗 -->
    <Teleport to="body">
        <Transition name="upgrade-fade">
            <div v-if="showUpgradeDialog" class="upgrade-overlay" @click.self="showUpgradeDialog = false">
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
                                    @click="handleSendCode"
                                    type="primary"
                                    class="code-btn"
                                    :disabled="codeCooldown > 0 || !upgradeForm.name || !upgradeForm.email || sendingCode"
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
                                    @click="handleUpgrade"
                                    type="primary"
                                    class="submit-btn"
                                    :loading="upgradeSubmitting"
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
import { computed, onMounted, ref, reactive, onUnmounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import StudentItem from './StudentItem.vue'
import TeacherItem from './TeacherItem.vue'
import AdminItem from './AdminItem.vue'
import GuestItem from './GuestItem.vue'
import { getNotificationCountApi } from '@/api/notification/notification.api'
import { guestUpgradeApi, guestSendCodeApi } from '@/api/guest/guest.api'
import NotificationDialog from '@/components/notification-dialog/NotificationDialog.vue'
import { UserAvatar } from '@/components/user-avatar'
import { UserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'

// 导入全局事件总线
import { emitter } from '@/utils/emitter'

const drawer = ref(false)
const showUpgradeDialog = ref(false)

// 用户信息
const userStore = UserStore()
const userInfo = computed(() => userStore.getUser())

const role = ref(userStore.getRole())

const sidebarStore = SidebarStore()

function toggleSidebar() {
    sidebarStore.toggle()
}

const deviceTypeStore = DeviceTypeStore()

function closeDrawer() {
    drawer.value = false
}

async function openDrawer() {
    drawer.value = true
}

const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && drawer.value) {
        closeDrawer()
    }
}

// 添加键盘事件监听
watch(drawer, (val) => {
    if (val) {
        document.body.style.overflow = 'hidden' // 防止背景滚动
        document.addEventListener('keydown', handleEscKey)
    } else {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscKey)
    }
})
// 定义事件处理函数
const handleQuestionDetailOpened = async () => {
    // 延迟一小段时间确保后端已经处理完标记为已读的操作
    setTimeout(() => {
        getNotificationCount()
    }, 1500)
}

onMounted(() => {
    getNotificationCount()
    // 监听问题详情页打开事件
    emitter.on('questionDetailOpened', handleQuestionDetailOpened)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
    emitter.off('questionDetailOpened', handleQuestionDetailOpened)
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscKey)
})

const newQuestionCount = ref(0)
const newAnswerCount = ref(0)
const newReplyCount = ref(0)

async function getNotificationCount() {
    await getNotificationCountApi(userInfo.value.id)
        .then((res) => {
            if (res != null) {
                newQuestionCount.value = res.new_question_count
                newAnswerCount.value = res.new_answer_count
                newReplyCount.value = res.new_reply_count
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

const router = useRouter()

function navigateToUserInfo() {
    if (deviceTypeStore.isMobile) {
        sidebarStore.toggle()
    }
    router.push(`/user/${userInfo.value.id}`)
}

// --- 升级表单逻辑 ---
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

async function handleSendCode() {
    if (!upgradeForm.name || !upgradeForm.email) return
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
        // error handled by interceptor
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
            showUpgradeDialog.value = false
            ElMessage.success('升级成功！')
            role.value = userStore.getRole()
        }
    } catch {
        // error handled by interceptor
    } finally {
        upgradeSubmitting.value = false
    }
}
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    width: 300px;
    border-right: 1px solid $su-border;
    overflow: hidden;
    @media (max-width: 768px) and (min-width: 300px) {
        width: 80vw;
    }
    @media (max-width: 300px) {
        width: 100vw;
    }

    .title {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 10%;
        margin-bottom: 25px;

        @media (max-width: 768px) {
            justify-content: space-between;
        }
        @media (min-width: 768px) {
            justify-content: flex-end;
        }

        .sidebar-btn {
            cursor: pointer;
            padding: 5px;
            transition: transform 0.3s ease;
        }

        .sidebar-btn:hover {
            transform: scale(1.1);
        }

        .message:hover {
            transform: scale(1.1);
        }

        .message {
            position: relative;
            cursor: pointer;
            padding: 5px;
            transition: transform 0.3s ease;

            .red-dot {
                width: 10px;
                height: 10px;
                background-color: red;
                border-radius: 50%;
                position: absolute;
                top: 0;
                right: 0;
                animation: scale-in-center 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both;
            }

            @keyframes scale-in-center {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }

                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        }
    }

    .avatar-and-id {
        padding: 0 15%;

        .user-avatar {
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .user-avatar:hover {
            transform: scale(1.1);
        }

        .user-name {
            cursor: pointer;
            text-align: left;
            font-size: 25px;
            font-weight: bold;
            margin-top: 10px;
        }

        .user-name:hover {
            text-decoration: underline;
        }

        .user-id {
            cursor: pointer;
            text-align: left;
            font-size: 13px;
            color: #808080;
            margin-top: 10px;
        }
    }

    .control-panel {
        padding: 0 15%;

        .guest-login-hint {
            padding: 0 15%;
            margin-top: 12px;

            .guest-login-btn {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 13px;
                color: #909399;
                transition: color 0.2s ease;
                padding: 4px 0;

                &:hover {
                    color: #71B6FF;
                }
            }
        }
    }
}

/* 抽屉相关样式 */
.custom-drawer-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(30px);
}

.custom-drawer {
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    background-color: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
}

/* 抽屉动画效果 */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
    transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
    opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
    transition: transform 0.3s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
    transform: translateX(100%);
}

/* 通知相关动画 */
.notification-enter-active,
.notification-leave-active {
    transition: opacity 0.5s;
}

.notification-enter-from,
.notification-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* 升级弹窗样式 */
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

    .dialog-card {
        display: flex;
        flex-direction: column;
        padding: 30px 25px;
        background: linear-gradient(to bottom, #f8faff, #ffffff);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

        .title-container {
            text-align: center;
            margin-bottom: 20px;

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
        }

        .form-container {
            display: flex;
            flex-direction: column;
            gap: 14px;

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

/* 弹窗动画 */
.upgrade-fade-enter-active,
.upgrade-fade-leave-active {
    transition: opacity 0.25s ease;
}

.upgrade-fade-enter-from,
.upgrade-fade-leave-to {
    opacity: 0;
}
</style>
