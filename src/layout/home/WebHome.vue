<script lang="ts" setup>
import { DeviceTypeStore } from '@/store/modules/device-type'
import { SidebarStore } from '@/store/modules/sidebar'
import AnnouncementBanner from '@/components/announcement-banner/AnnouncementBanner.vue'
import {
    ADMIN_ANNOUNCEMENTS_ROUTE_NAME,
    ANNOUNCEMENT_LIST_ROUTE_NAME,
} from '@/constants/announcement'

const sidebarStore = SidebarStore()
const deviceStore = DeviceTypeStore()
const toggleSidebar = (event: MouseEvent) => {
    if (event.target === event.currentTarget && deviceStore.isMobile && sidebarStore.IsOpen) {
        sidebarStore.close()
    }
}
</script>

<template>
    <div class="container" :class="{ 'sidebar-open': sidebarStore.IsOpen }">
        <Transition name="sidebar_anime" appear>
            <aside class="sidebar-aside" v-show="sidebarStore.IsOpen">
                <router-view key="$route.fullPath" name="left_side"> </router-view>
            </aside>
        </Transition>
        <main class="main-content" @click="toggleSidebar">
            <AnnouncementBanner />
            <router-view v-slot="{ Component }">
                <keep-alive
                    :exclude="[
                        'QuestionDetail',
                        'QuestionManagementDetail',
                        'UserRoot',
                        'UserInfo',
                        'AskTeacherRoot',
                        'AskTeacherDetail',
                        'AskTeacher',
                        'Login',
                        ANNOUNCEMENT_LIST_ROUTE_NAME,
                        ADMIN_ANNOUNCEMENTS_ROUTE_NAME,
                    ]"
                >
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </main>
        <aside class="right-aside">
            <router-view name="right_side" />
        </aside>
    </div>
</template>

<style scoped lang="scss">
.sidebar_anime-enter-active,
.sidebar_anime-leave-active {
    transition:
        all 0.5s ease,
        opacity 0.5s ease;
}

.sidebar_anime-enter-from,
.sidebar_anime-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

.sidebar_anime-enter-to,
.sidebar_anime-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.sidebar-aside {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
}

.container {
    display: flex;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    position: relative;
    overflow: hidden;
    transition: margin-left 0.5s ease;
}

.main-content {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0;
    margin-left: 300px;
    transition:
        margin-left 0.5s ease,
        filter 0.5s ease;
}

.right-aside {
    flex: 0 0 auto;
}

.container:not(.sidebar-open) .main-content {
    margin-left: 0;
    filter: none;
}

@media (max-width: 768px) {
    .container.sidebar-open .main-content {
        filter: blur(100px);
        // pointer-events: none;
        > * {
            pointer-events: none;
        }
    }
}
</style>
