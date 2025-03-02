<template>
    <el-container class="help-container">
        <el-header class="help-header">
            <QuestionHeader @sidebar="sidebar" sidebar_btn> </QuestionHeader>
            <div class="help-title">
                <p>帮助</p>
            </div>
        </el-header>
        <el-main class="help-main">
            <MdPreview class="md" :id="id" :modelValue="helpInfo" />
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import QuestionHeader from "@/components/question-header/QuestionHeader.vue";
import { SidebarStore } from "@/store/modules/sidebar";
import MarkdownIt from "markdown-it";
import { MdPreview } from 'md-editor-v3';
import { computed, onMounted, ref } from "vue";


const sidebarStore = SidebarStore();
const sidebar = () => {
    sidebarStore.toggle();
};

// md-editor
const id = 'preview-only';
const helpInfo = ref<string>("");

onMounted(async () => {
    try {
        const response = await fetch("/help/help.md");
        helpInfo.value = await response.text();
        console.log(helpInfo.value);
    } catch (error) {
        console.error(error);
    }
});
</script>

<style scoped lang="scss" src="./help.scss"></style>
