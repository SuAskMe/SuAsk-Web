<script setup lang="ts">
defineProps<{
    author: string
    text: string
}>()

defineEmits(['quote'])
</script>

<template>
    <div class="quote-container" @click.stop="$emit('quote')">
        <div class="author">{{ author }}</div>
        <div class="sep">:</div>
        <div class="quote-text">{{ text }}</div>
    </div>
</template>

<style scoped lang="scss">
.quote-container {
    background-color: #add3fe69;
    border-radius: 8px;
    padding: 0.5em;
    display: flex;
    align-items: flex-end;
    margin-bottom: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
}

.author {
    font-size: 0.9em;
    font-weight: bold;
    color: #77b9ff;
    max-width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
}

.sep {
    font-size: 0.9em;
    font-weight: bold;
    color: #77b9ff;
    margin-right: 6px;
}

.quote-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9em;
    color: $su-grey;
}
</style>
