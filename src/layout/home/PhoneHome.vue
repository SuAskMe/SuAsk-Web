<template>
    <el-container>
        <el-header style="height: auto;">
            <router-view name="header" :deviceType="deviceType" :userType="userType" />
        </el-header>
        <el-main>
            <el-scrollbar>
                <router-view :deviceType="deviceType" :userType="userType" />
            </el-scrollbar>
        </el-main>
        <el-footer style="height: auto;">
            <router-view name="footer" :deviceType="deviceType" :userType="userType" />
        </el-footer>
    </el-container>
</template>

<script setup lang='ts'>
defineProps({
    userType: String,
    deviceType: String,
});
</script>

<style scoped lang="scss">
.el-container {
    height: 100dvh;

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
