<template>
    <div class="sidebar-header">
        <div class="message" @click="$emit('openDrawer')">
            <svg-icon class="message-icon" icon="message-1" color="#71B6FF" size="26px" />
            <div v-if="hasUnread" class="red-dot" />
        </div>
        <div v-if="isMobile" class="sidebar-btn-container" @click="$emit('toggleSidebar')">
            <svg-icon
                class="sidebar-btn"
                icon="sidebar"
                color="#71B6FF"
                size="26px"
                :filled="isSidebarOpen"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    hasUnread: boolean
    isMobile: boolean
    isSidebarOpen: boolean
}>()

defineEmits(['openDrawer', 'toggleSidebar'])
</script>

<style scoped lang="scss">
.sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 10%;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        justify-content: space-between;
        padding-top: 10px;
    }

    @media (min-width: 768px) {
        justify-content: flex-end;
    }
}

.sidebar-btn-container {
    cursor: pointer;
    padding: 5px;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none !important;
    border: none !important;
    background: transparent !important;
    -webkit-tap-highlight-color: transparent;
}

.sidebar-btn-container:hover {
    transform: scale(1.1);
}

.sidebar-btn {
    width: 26px !important;
    height: 26px !important;
    outline: none !important;
    border: none !important;
    background: transparent !important;
}

.message {
    position: relative;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.3s ease;
    outline: none !important;
    border: none !important;
    background: transparent !important;
    -webkit-tap-highlight-color: transparent;
}

.message-icon {
    width: 26px !important;
    height: 26px !important;
    outline: none !important;
    border: none !important;
    background: transparent !important;
}

.message:hover {
    transform: scale(1.1);
}

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
</style>
