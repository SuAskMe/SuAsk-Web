<template>
    <el-container class="help-container">
        <el-header class="help-header">
            <QuestionHeader @sidebar="sidebar" sidebar_btn> </QuestionHeader>
            <div class="help-title">
                <p>帮助</p>
                <div
                    style="width: 80%; height: 0.5px; background-color: #9e9e9e"
                ></div>
            </div>
        </el-header>
        <el-main class="help-main"> TODO: 帮助文档内容 </el-main>
    </el-container>
</template>

<script setup lang="ts">
import QuestionHeader from "@/components/question-header/QuestionHeader.vue";
import { SidebarStore } from "@/store/modules/sidebar";
const sidebarStore = SidebarStore();

const sidebar = () => {
    sidebarStore.toggle();
};
</script>

<style scoped lang="scss" src="./help.scss"></style>
