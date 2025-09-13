<template>
    <div class="sidebar">
        <div class="title">
            <div v-if="role != 'default'" class="message">
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
            <el-avatar :size="120" :src="userInfo.avatar">
                <img src="@/assets/default-avatar.png" />
            </el-avatar>
            <div class="user-name">
                <span>{{ userInfo.nickname }}</span>
            </div>
            <div class="user-id">
                <span>@{{ userInfo.name }}</span>
            </div>
        </div>
        <div class="control-panel">
            <el-button
                v-if="role == 'default'"
                type="info"
                text
                class="login"
                @click="navigateToLogin"
            >
                登录以获取更多功能
            </el-button>
            <student-item v-if="role == 'student'" />
            <teacher-item v-else-if="role == 'teacher'" />
            <default-item v-else-if="role == 'default'" />
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import StudentItem from './StudentItem.vue'
import TeacherItem from './TeacherItem.vue'
import DefaultItem from './DefaultItem.vue'
import { ElMessage } from 'element-plus'
import { getNotificationCountApi } from '@/api/notification/notification.api'
import NotificationDialog from '@/components/notification-dialog/NotificationDialog.vue'
import { UserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'

// 导入全局事件总线
import { emitter } from '@/utils/emitter'

const drawer = ref(false)

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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // 更新通知计数
    if (role.value != 'default') {
        getNotificationCount()
    }
}

onMounted(() => {
    if (role.value != 'default') {
        getNotificationCount()
    }
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
    if (userStore.getRole() != 'default') {
        if (deviceTypeStore.isMobile) {
            sidebarStore.toggle()
        }
        router.push(`/user/${userInfo.value.id}`)
    } else {
        ElMessage.info('请登录')
        router.push('/login')
    }
}

function navigateToLogin() {
    router.push('/login')
}
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    width: 300px;
    border-right: 1px solid $su-border;
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

        .el-avatar {
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .el-avatar:hover {
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

        .login {
            margin-top: 20px;
            cursor: pointer;
            height: 40px;
            border-radius: 20px;
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
</style>
