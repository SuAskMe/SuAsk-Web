<script lang="ts" setup>
</script>

<template>
    <a-layout style="height: 100vh;">
        <a-layout-sider style="width: 300px">
            <router-view name="sidebar" />
        </a-layout-sider>
        <a-layout style="width: 100%;">
            <router-view />
        </a-layout>
    </a-layout>
</template>

<style scoped lang="scss"></style>