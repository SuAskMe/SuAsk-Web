<template>
    <div
        class="generated-background"
        :class="`generated-background--theme-${themeIndex}`"
        aria-hidden="true"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    img_index?: number
    imgIndex?: number
}>()

const themeCount = 5

const themeIndex = computed(() => {
    const rawIndex = props.img_index ?? props.imgIndex ?? 1
    const index = Number.isFinite(rawIndex) ? Math.trunc(rawIndex) : 1

    if (index < 1 || index > themeCount) {
        return 1
    }

    return index
})
</script>

<style scoped lang="scss">
.generated-background {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background:
        linear-gradient(132deg, var(--theme-wash-a) 0%, transparent 42%),
        linear-gradient(228deg, var(--theme-wash-b) 0%, transparent 44%),
        linear-gradient(180deg, var(--theme-base) 0%, var(--theme-surface) 100%);
}

.generated-background--theme-1 {
    --theme-base: #f7fbff;
    --theme-surface: #eaf5ff;
    --theme-wash-a: rgba(113, 182, 255, 0.36);
    --theme-wash-b: rgba(255, 208, 122, 0.22);
}

.generated-background--theme-2 {
    --theme-base: #f6fff9;
    --theme-surface: #e9f8f2;
    --theme-wash-a: rgba(82, 196, 161, 0.28);
    --theme-wash-b: rgba(255, 186, 120, 0.2);
}

.generated-background--theme-3 {
    --theme-base: #fbf8ff;
    --theme-surface: #eff4ff;
    --theme-wash-a: rgba(139, 160, 255, 0.26);
    --theme-wash-b: rgba(255, 148, 178, 0.18);
}

.generated-background--theme-4 {
    --theme-base: #fffaf2;
    --theme-surface: #f3f8f5;
    --theme-wash-a: rgba(255, 198, 93, 0.24);
    --theme-wash-b: rgba(90, 184, 214, 0.18);
}

.generated-background--theme-5 {
    --theme-base: #f8fafc;
    --theme-surface: #eef2f7;
    --theme-wash-a: rgba(100, 116, 139, 0.18);
    --theme-wash-b: rgba(113, 182, 255, 0.2);
}
</style>
