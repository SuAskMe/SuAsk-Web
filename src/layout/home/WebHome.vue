<script lang="ts" setup>
import { DeviceTypeStore } from "@/store/modules/device-type";
import { SidebarStore } from "@/store/modules/sidebar";

const sidebarStore = SidebarStore();
const deviceStore = DeviceTypeStore();
const toggleSidebar = (event: MouseEvent) => {
    if (
        event.target === event.currentTarget &&
        deviceStore.isMobile &&
        sidebarStore.IsOpen
    ) {
        sidebarStore.close();
    }
};
</script>

<template>
    <el-container
        class="container"
        :class="{ 'sidebar-open': sidebarStore.IsOpen }"
    >
        <Transition name="sidebar_anime" appear>
            <el-aside
                class="sidebar-aside"
                width="auto"
                v-show="sidebarStore.IsOpen"
            >
                <router-view key="$route.fullPath" name="left_side">
                </router-view>
            </el-aside>
        </Transition>
        <el-main class="main-content" @click="toggleSidebar">
            <router-view v-slot="{ Component }">
                <keep-alive
                    :exclude="[
                        'QuestionDetail',
                        'UserRoot',
                        'User',
                        'AskTeacherRoot',
                        'AskTeacherDetail',
                        'AskTeacher',
                        'Login',
                    ]"
                >
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </el-main>
        <el-aside width="auto">
            <router-view name="right_side" />
        </el-aside>
    </el-container>
</template>

<style scoped lang="scss">
.sidebar_anime-enter-active,
.sidebar_anime-leave-active {
    transition: all 0.5s ease, opacity 0.5s ease;
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
    background: white;
}

.container {
    height: 100vh;
    position: relative;
    transition: margin-left 0.5s ease;
}

.main-content {
    margin-left: 300px;
    transition: margin-left 0.5s ease, filter 0.5s ease;
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

.el-container {
    height: 100vh;

    .el-main {
        --el-main-padding: 0 !important;
    }

    .el-header {
        border-bottom: 1px solid $su-border;
    }

    .el-footer {
        border-top: 1px solid $su-border;
    }
}
</style>
