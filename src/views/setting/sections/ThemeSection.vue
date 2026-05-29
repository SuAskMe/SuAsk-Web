<template>
    <SettingSectionCard
        title="主题"
        description="主题会同步影响主背景和部分列表页面的视觉氛围。"
        :icon="icon"
    >
        <div class="theme-picker">
            <div class="theme">
                <ThemeImage
                    :model-value="themeId"
                    :width="'150px'"
                    @update:model-value="$emit('update:themeId', $event)"
                />
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import ThemeImage from '../ThemeImage.vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    themeId: number
    icon?: string
}>()

defineEmits(['update:themeId'])
</script>

<style scoped lang="scss">
.theme-picker {
    overflow-x: auto;
    padding: 0.25rem 0.5rem;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 3px;
    }
}

.theme {
    display: flex;
    padding: 0.5em 0;
}
</style>
