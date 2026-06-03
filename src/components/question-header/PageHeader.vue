<template>
    <div class="page-header">
        <div class="page-header__left">
            <slot name="left" />
        </div>
        <div v-if="title && showTitle" class="page-header__title">{{ title }}</div>
        <div class="page-header__right">
            <slot name="right" />
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string
        showTitle?: boolean
    }>(),
    {
        title: '',
        showTitle: true,
    },
)
</script>

<style scoped lang="scss">
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 24px;
    margin-left: auto;
    gap: 10px;
    user-select: none;
}

.page-header__left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.page-header__title {
    color: var(--su-blue-dark);
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.page-header__right {
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 12px;
    min-width: 0;
}
</style>
