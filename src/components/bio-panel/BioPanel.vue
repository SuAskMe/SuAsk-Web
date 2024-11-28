<template>
    <MdEditor :footers="[]" placeholder="问题内容，支持 Markdown，点击左上角图标预览" :preview="false" :toolbars="toolbars"
        v-model="contents" :style="{ height: fullscreen ? '100%' : '350px' }" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { MdEditor, type ToolbarNames } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

defineProps<{
    fullscreen?: boolean;
}>();

const toolbars: ToolbarNames[] = [
    'previewOnly',
];

const contents = ref('');
</script>

<style></style>
