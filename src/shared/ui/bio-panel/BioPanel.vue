<template>
    <textarea
        v-model="contents"
        class="bio-textarea"
        placeholder="请输入..."
        :disabled="disabled"
        :style="{ height: fullscreen ? '100%' : '350px' }"
    />
</template>

<script setup lang="ts">
defineProps<{
    fullscreen?: boolean
    disabled?: boolean
}>()

const contents = defineModel<string>({ default: '' })
</script>

<style scoped lang="scss">
.bio-textarea {
    width: 100%;
    min-height: 180px;
    resize: vertical;
    box-sizing: border-box;
    padding: 0.85rem 1rem;
    border: 1px solid rgba(113, 182, 255, 0.28);
    border-radius: 10px;
    outline: none;
    background-color: #ffffff;
    color: #1f2937;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;

    &:focus {
        border-color: $su-blue;
        box-shadow: 0 0 0 3px rgba(113, 182, 255, 0.14);
    }

    &:disabled {
        cursor: not-allowed;
        background-color: #f3f4f6;
        color: #9ca3af;
    }
}
</style>
