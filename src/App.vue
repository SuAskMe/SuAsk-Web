<script setup lang="ts">
// 初始化时设置高度
function setRealVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// 监听窗口变化（如地址栏隐藏、横竖屏切换）
window.addEventListener("resize", setRealVH);
window.addEventListener("orientationchange", setRealVH);

// 首次加载执行
setRealVH();
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
