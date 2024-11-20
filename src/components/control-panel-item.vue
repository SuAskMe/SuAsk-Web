<template>
    <div class="control-item" @click="handleClick">
        <svg-icon v-if="icon" :icon="props.icon" color="#71B6FF" :size="size ? size : '24px'" :filled="clicked" />
        <div v-if="text" style="padding-left: 20px;"></div>
        <p v-if="text" :class="{ text: !clicked, 'text-clicked': clicked }">{{ text }}</p>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
    id: string;
    icon?: string;
    size?: string;
    text?: string;
    clicked?: boolean;
}>();

const emit = defineEmits(['updateSelected']);

// 点击事件，通知父组件更新选中状态
const handleClick = () => {
    emit('updateSelected', props.id);
};
</script>

<style scoped>
.control-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    height: 30px;
}

.text {
    line-height: 30px;
    font-size: 18px;
}

.text-clicked {
    line-height: 30px;
    font-size: 18px;
    color: #71B6FF;
    font-weight: bold;
}
</style>
