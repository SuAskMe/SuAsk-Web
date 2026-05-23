<template>
    <section class="setting-section-card" :class="{ 'setting-section-card--danger': danger }">
        <div class="setting-section-card__head">
            <div class="setting-section-card__text">
                <h2 class="setting-section-card__title">{{ title }}</h2>
                <p v-if="description" class="setting-section-card__desc">{{ description }}</p>
            </div>
            <div v-if="$slots.action" class="setting-section-card__action">
                <slot name="action" />
            </div>
        </div>
        <div class="setting-section-card__body">
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title: string
        description?: string
        danger?: boolean
    }>(),
    {
        description: '',
        danger: false,
    },
)
</script>

<style scoped lang="scss">
.setting-section-card {
    position: relative;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94)), #fff;
    border: 1px solid rgba(17, 24, 39, 0.06);
    border-radius: 16px;
    padding: 1.25rem 1.25rem 1.1rem;
    margin-bottom: 1.5rem;
    box-shadow:
        0 10px 30px rgba(15, 23, 42, 0.06),
        0 1px 0 rgba(255, 255, 255, 0.7) inset;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 4px;
        border-radius: 16px 16px 0 0;
        background: linear-gradient(90deg, #71b6ff, #4891e0);
        opacity: 0.9;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow:
            0 16px 36px rgba(15, 23, 42, 0.09),
            0 1px 0 rgba(255, 255, 255, 0.7) inset;
    }
}

.setting-section-card--danger {
    border-color: rgba(239, 68, 68, 0.15);

    &::before {
        background: linear-gradient(90deg, #ff7b7b, #f56c6c);
    }
}

.setting-section-card__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
}

.setting-section-card__text {
    min-width: 0;
}

.setting-section-card__title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 650;
    color: #1f2937;
}

.setting-section-card__desc {
    margin: 0.35rem 0 0;
    color: #6b7280;
    font-size: 0.92rem;
    line-height: 1.5;
}

.setting-section-card__body {
    min-width: 0;
}
</style>
