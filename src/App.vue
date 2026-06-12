<script setup lang="ts">
import { DeviceTypeStore } from '@/shared/model/device-type.store'
const deviceType = DeviceTypeStore()
function setRealVH() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}
if (deviceType.isMobile) {
    // 首次加载执行
    setRealVH()
    // 监听窗口变化（如地址栏隐藏）
    window.addEventListener('resize', setRealVH)
}
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
