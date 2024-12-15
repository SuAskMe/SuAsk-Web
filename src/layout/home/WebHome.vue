<script lang="ts" setup>
defineProps({
    userType: String,
    deviceType: String,
});
</script>

<template>
    <el-container>
        <el-aside width="300px">
            <router-view
                name="sidebar"
                :deviceType="deviceType"
                :userType="userType"
            />
        </el-aside>
        <el-container>
            <el-header style="height: auto">
                <router-view
                    name="header"
                    :deviceType="deviceType"
                    :userType="userType"
                />
            </el-header>
            <el-main>
                <router-view
                    :deviceType="deviceType"
                    :userType="userType"
                    v-slot="{ Component }"
                >
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </el-main>
            <el-footer style="height: auto">
                <router-view
                    name="footer"
                    :deviceType="deviceType"
                    :userType="userType"
                />
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
