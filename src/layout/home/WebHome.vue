<script lang="ts" setup>
</script>

<template>
    <el-container>
        <el-aside width="auto">
            <router-view name="left_side" />
        </el-aside>
        <el-container>
            <el-header style="height: auto">
                <router-view name="header" />
            </el-header>
            <el-main>
                <router-view v-slot="{ Component }">
                    <keep-alive :exclude="['QuestionDetail']">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </el-main>
            <el-footer style="height: auto">
                <router-view name="footer" />
            </el-footer>
        </el-container>
        <el-aside width="auto">
            <router-view name="right_side" />
        </el-aside>
    </el-container>
</template>

<style scoped lang="scss">
.el-container {
    height: 100vh;

    .el-main {
        --el-main-padding: 0 !important;
    }

    // .el-aside {
    //     border-right: 1px solid $su-border;
    //     height: 100%;
    // }

    .el-header {
        border-bottom: 1px solid $su-border;
    }

    .el-footer {
        border-top: 1px solid $su-border;
    }
}
</style>
