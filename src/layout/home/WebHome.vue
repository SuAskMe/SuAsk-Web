<script lang="ts" setup>
</script>

<template>
    <el-container style="height: 100vh;">
        <el-aside width="300px">
            <router-view name="sidebar" />
        </el-aside>
        <el-container>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped lang="scss"></style>