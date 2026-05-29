<template>
    <section class="setting-section-card" :class="{ 'setting-section-card--danger': danger }">
        <div class="setting-section-card__head">
            <div class="setting-section-card__title-wrap">
                <div v-if="icon" class="setting-section-card__icon">
                    <svg-icon :icon="icon" size="22px" />
                </div>
                <div class="setting-section-card__text">
                    <h2 class="setting-section-card__title">{{ title }}</h2>
                    <p v-if="description" class="setting-section-card__desc">{{ description }}</p>
                </div>
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
        icon?: string
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
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(113, 182, 255, 0.12);
    border-radius: 16px;
    padding: 1.75rem;
    margin-bottom: 1.5rem;
    box-shadow:
        0 8px 30px rgba(15, 23, 42, 0.03),
        0 1px 0 rgba(255, 255, 255, 0.8) inset;
    transition:
        transform 0.3s cubic-bezier(0.25, 1, 0.5, 1),
        box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1),
        border-color 0.3s ease;
    animation: fadeInUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;

    &:hover {
        transform: translateY(-4px);
        border-color: rgba(113, 182, 255, 0.28);
        box-shadow:
            0 16px 36px rgba(113, 182, 255, 0.08),
            0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }
}

.setting-section-card--danger {
    border-color: rgba(239, 68, 68, 0.15);

    &:hover {
        border-color: rgba(239, 68, 68, 0.35);
        box-shadow:
            0 16px 36px rgba(239, 68, 68, 0.06),
            0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }
}

.setting-section-card__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.setting-section-card__title-wrap {
    display: flex;
    align-items: center;
    gap: 0.95rem;
    min-width: 0;
}

.setting-section-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(113, 182, 255, 0.15) 0%, rgba(113, 182, 255, 0.04) 100%);
    border: 1px solid rgba(113, 182, 255, 0.22);
    color: #4891e0;
    flex-shrink: 0;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 
        0 0 0 0px rgba(113, 182, 255, 0),
        inset 0 1.5px 2px rgba(255, 255, 255, 0.75),
        0 4px 8px rgba(113, 182, 255, 0.04);

    .setting-section-card:hover & {
        transform: scale(1.06) rotate(3deg);
        background: linear-gradient(135deg, rgba(113, 182, 255, 0.22) 0%, rgba(113, 182, 255, 0.06) 100%);
        border-color: rgba(113, 182, 255, 0.38);
        color: #3b82f6;
        box-shadow: 
            0 0 0 5px rgba(113, 182, 255, 0.08),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.8),
            0 8px 16px rgba(113, 182, 255, 0.1);
    }
}

.setting-section-card--danger .setting-section-card__icon {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.04) 100%);
    border-color: rgba(239, 68, 68, 0.22);
    color: #ff4d4f;
    box-shadow: 
        0 0 0 0px rgba(239, 68, 68, 0),
        inset 0 1.5px 2px rgba(255, 255, 255, 0.75),
        0 4px 8px rgba(239, 68, 68, 0.04);

    .setting-section-card:hover & {
        transform: scale(1.06) rotate(3deg);
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(239, 68, 68, 0.06) 100%);
        border-color: rgba(239, 68, 68, 0.38);
        color: #ef4444;
        box-shadow: 
            0 0 0 5px rgba(239, 68, 68, 0.08),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.8),
            0 8px 16px rgba(239, 68, 68, 0.1);
    }
}

.setting-section-card__text {
    min-width: 0;
}

.setting-section-card__title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    color: #111827;
    line-height: 1.3;
}

.setting-section-card__desc {
    margin: 0.35rem 0 0;
    color: #6b7280;
    font-size: 0.88rem;
    line-height: 1.5;
}

.setting-section-card__body {
    min-width: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
