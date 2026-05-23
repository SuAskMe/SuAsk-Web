<template>
    <SettingSectionCard
        title="提问箱可见性"
        description="控制其他用户访问当前提问箱时，看到的是公开、登录后可见还是完全关闭。"
        :icon="icon"
    >
        <div class="visibility-selector">
            <div
                v-for="option in options"
                :key="option.value"
                class="visibility-card"
                :class="{ active: modelValue === option.value }"
                @click="$emit('update:modelValue', option.value)"
            >
                <div class="card-content">
                    <div class="icon-container">
                        <component :is="option.icon" />
                    </div>
                    <h3 class="option-title">{{ option.title }}</h3>
                    <p class="option-desc">{{ option.description }}</p>
                </div>
                <div class="selection-mark">
                    <component :is="Check" class="check-icon" />
                </div>
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import { type Component } from 'vue'
import { Lock, TurnOff, View, Check } from '@element-plus/icons-vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    modelValue: string
    icon?: string
}>()

defineEmits(['update:modelValue'])

const options = [
    {
        value: 'public',
        title: '公开',
        description: '任何人都可以访问提问箱',
        icon: View,
    },
    {
        value: 'protected',
        title: '需登录',
        description: '仅登录用户可以访问提问箱',
        icon: Lock,
    },
    {
        value: 'private',
        title: '关闭',
        description: '暂时关闭提问箱，无法访问',
        icon: TurnOff,
    },
]
</script>

<style scoped lang="scss">
.visibility-selector {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin: 0 auto;
    padding: 0.25rem;
}

.visibility-card {
    position: relative;
    width: calc((100% - 2.5rem) / 3);
    max-width: 300px;
    min-height: 150px;
    border-radius: 14px;
    background: #ffffff;
    border: 1.5px solid rgba(17, 24, 39, 0.06);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        min-height: 120px;
    }

    &:hover {
        transform: translateY(-4px);
        border-color: rgba(113, 182, 255, 0.4);
        box-shadow: 0 8px 20px rgba(113, 182, 255, 0.08);

        .icon-container {
            background-color: rgba(113, 182, 255, 0.1);
            color: #71b6ff;
        }
    }

    &.active {
        border-color: $su-blue;
        box-shadow: 0 8px 24px rgba(113, 182, 255, 0.18);
        background: linear-gradient(
            165deg,
            rgba(113, 182, 255, 0.02),
            rgba(113, 182, 255, 0.08)
        );
        transform: translateY(-4px) scale(1.02);

        .icon-container {
            background: $su-blue;
            color: white;
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(113, 182, 255, 0.3);
        }

        .option-title {
            color: #4891e0;
        }

        .selection-mark {
            opacity: 1;
            transform: scale(1);
        }
    }
}

.card-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        flex-direction: row;
        text-align: left;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }
}

.icon-container {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    color: #9ca3af;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    margin-bottom: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 768px) {
        margin-bottom: 0;
    }
}

.option-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.35rem 0;
    transition: color 0.3s ease;
}

.option-desc {
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.4;
}

.selection-mark {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 18px;
    height: 18px;
    background-color: $su-blue;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 6px rgba(113, 182, 255, 0.4);

    @media (max-width: 768px) {
        top: auto;
        bottom: 12px;
        right: 12px;
    }

    .check-icon {
        width: 11px;
        height: 11px;
        color: #ffffff;
        stroke: #ffffff;
        stroke-width: 2.5;
    }
}
</style>

