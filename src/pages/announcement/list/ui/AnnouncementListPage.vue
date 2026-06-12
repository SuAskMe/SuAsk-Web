<template>
    <section class="announcement-page">
        <header class="announcement-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>公告中心</h2>
        </header>

        <el-scrollbar class="announcement-content">
            <AnnouncementList />
        </el-scrollbar>
    </section>
</template>

<script setup lang="ts">
import { SidebarStore } from '@/widgets/app-shell/model'
import QuestionHeader from '@/widgets/question-header'
import AnnouncementList from '@/widgets/announcement-list'

const sidebarStore = SidebarStore()

function toggleSidebar() {
    sidebarStore.toggle()
}
</script>

<style scoped lang="scss">
.announcement-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
}

.announcement-header {
    flex-shrink: 0;
    padding: 16px 20px 12px;

    h2 {
        margin: 8px 0 0;
        font-size: 22px;
        font-weight: 600;
        color: #1a1a1a;
    }
}

.announcement-content {
    flex: 1;
    padding: 0 20px 20px;
}
</style>
