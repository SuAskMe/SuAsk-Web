<script setup lang='ts'>
import { ref } from 'vue';
import { MdEditor, type ToolbarNames } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const visible = defineModel('visible', { default: false });

defineProps<{
    fullscreen?: boolean;
    teacherName?: string;
}>();

const toolbars: ToolbarNames[] = [
    'previewOnly',
    '=',
    'title',
    'bold',
    'quote',
    'codeRow',
    'link',
    '-',
    'orderedList',
    'unorderedList',
    '-',
    'image',
    'fullscreen',
];

const title = ref('');
const contents = ref('');
const isPublic = ref(false);
</script>

<template>
    <el-dialog v-model="visible" title-align="start" :fullscreen="fullscreen" :default-visible="true" width="60%"
        okText="发布" body-style="height: 100%; padding: 0; display: flex; flex-direction: column;">
        <template #title>
            <svg-icon :icon="teacherName ? 'graduation-cap' : 'group'" color="#71B6FF" size="20px"
                style="margin: 0 10px 0 -8px;" />
            {{ teacherName ? `问${teacherName}老师` : `问大家` }}
        </template>
        <el-input size="large" placeholder="问题标题" clearable v-model="title" style="width: 100%;"
            :input-attrs="{ style: 'font-size: 16px;' }" />
        <MdEditor :footers="[]" placeholder="问题内容，支持 Markdown，点击左上角图标预览" :preview="false" :toolbars="toolbars"
            v-model="contents" :style="{ height: fullscreen ? '100%' : '350px' }" />
        <el-checkbox v-if="teacherName" style="margin: 8px;" v-model="isPublic">是否公开</el-checkbox>
    </el-dialog>
</template>

<style scoped></style>
