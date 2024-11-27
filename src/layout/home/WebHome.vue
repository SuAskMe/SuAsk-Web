<script lang="ts" setup>
</script>

<template>
    <el-container>
        <el-aside width="300px">
            <router-view name="sidebar" />
        </el-aside>
        <el-container>
            <el-header style="height: auto;">
                <router-view name="header" />
            </el-header>
            <el-main>
                <el-scrollbar>
                    <router-view />
                </el-scrollbar>
            </el-main>
            <el-footer style="height: auto;">
                <router-view name="footer" />
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped lang="scss">
.el-container {
    height: 100vh;

    .el-main {
        --el-main-padding: 0 !important;
    }

    .el-aside {
        border-right: 1px solid $su-border;
        height: 100%;
    }

    .el-header {
        border-bottom: 1px solid $su-border;
    }

    .el-footer {
        border-top: 1px solid $su-border;
    }
}
</style>