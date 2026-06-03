<template>
    <div class="sidebar">
        <SidebarHeaderBar
            :has-unread="notificationStore.unreadCount > 0"
            :is-mobile="deviceTypeStore.isMobile"
            :is-sidebar-open="sidebarStore.IsOpen"
            @open-drawer="drawer = true"
            @toggle-sidebar="toggleSidebar"
        />
        <SidebarUserSummary
            :avatar="userInfo.avatar"
            :nickname="userInfo.nickname"
            :name="userInfo.name"
            @open-profile="navigateToUserInfo"
        />
        <GuestUpgradePrompt v-if="role === 'guest'" @upgrade="showUpgradeDialog = true" />
        <div class="control-panel">
            <student-item v-if="role === 'student'" />
            <teacher-item v-else-if="role === 'teacher'" />
            <admin-item v-else-if="role === 'admin'" />
            <guest-item v-else-if="role === 'guest'" />
        </div>
    </div>
    <SidebarNotificationDrawer
        v-model="drawer"
        :is-mobile="deviceTypeStore.isMobile"
        :question-count="notificationStore.newQuestionCount"
        :answer-count="notificationStore.newAnswerCount"
        :reply-count="notificationStore.newReplyCount"
        :user-id="userInfo.id"
    />
    <GuestUpgradeModal v-model="showUpgradeDialog" @upgraded="handleUpgraded" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import StudentItem from './StudentItem.vue'
import TeacherItem from './TeacherItem.vue'
import AdminItem from './AdminItem.vue'
import GuestItem from './GuestItem.vue'
import SidebarHeaderBar from './SidebarHeaderBar.vue'
import SidebarUserSummary from './SidebarUserSummary.vue'
import GuestUpgradePrompt from './GuestUpgradePrompt.vue'
import SidebarNotificationDrawer from './SidebarNotificationDrawer.vue'
import GuestUpgradeModal from './GuestUpgradeModal.vue'
import { UserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { NotificationStore } from '@/store/modules/notification'

// 导入全局事件总线
import { emitter } from '@/utils/emitter'

const drawer = ref(false)
const showUpgradeDialog = ref(false)

const userStore = UserStore()
const userInfo = computed(() => userStore.getUser())
const role = computed(() => userStore.getRole())

const sidebarStore = SidebarStore()

function toggleSidebar() {
    sidebarStore.toggle()
}

const deviceTypeStore = DeviceTypeStore()
const notificationStore = NotificationStore()

const handleQuestionDetailOpened = async () => {
    // 问题详情页里“已读”写回后端不是同步完成的，这里保留一个短延迟，
    // 避免侧边栏未读红点先刷新、后端计数还没更新，导致用户看到状态回弹。
    setTimeout(() => {
        getNotificationCount(true)
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
})

async function getNotificationCount(force = false) {
    await notificationStore.loadCount(userInfo.value.id, force)
}

const router = useRouter()

function navigateToUserInfo() {
    if (deviceTypeStore.isMobile) {
        sidebarStore.toggle()
    }
    router.push(`/user/${userInfo.value.id}`)
}

function handleUpgraded() {
    getNotificationCount()
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
}

.control-panel {
    padding: 0 15%;
}
</style>
