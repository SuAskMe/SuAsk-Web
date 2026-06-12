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
                :class="[
                    'visibility-card',
                    'visibility-card--' + option.value,
                    { active: modelValue === option.value },
                ]"
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
    min-height: 155px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(17, 24, 39, 0.06);
    box-shadow:
        0 4px 12px rgba(15, 23, 42, 0.01),
        0 1px 0 rgba(255, 255, 255, 0.8) inset;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        min-height: 100px;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow:
            0 12px 24px rgba(15, 23, 42, 0.04),
            0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }

    &.active {
        transform: translateY(-4px) scale(1.02);

        .icon-container {
            color: #ffffff;
            transform: scale(1.05);
        }

        .selection-mark {
            opacity: 1;
            transform: scale(1);
        }
    }
}

.visibility-card--public {
    &:not(.active):hover {
        border-color: rgba(72, 145, 224, 0.45);
        .icon-container {
            background-color: rgba(72, 145, 224, 0.08);
            color: #4891e0;
        }
    }

    &.active {
        border-color: #4891e0;
        background: linear-gradient(
            135deg,
            rgba(72, 145, 224, 0.04) 0%,
            rgba(72, 145, 224, 0.01) 100%
        );
        box-shadow:
            0 10px 24px rgba(72, 145, 224, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);

        .icon-container {
            background: #4891e0;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(72, 145, 224, 0.25);
        }

        .option-title {
            color: #4891e0;
        }

        .selection-mark {
            background-color: #4891e0;
            box-shadow: 0 2px 6px rgba(72, 145, 224, 0.35);
        }
    }
}

.visibility-card--protected {
    &:not(.active):hover {
        border-color: rgba(230, 162, 60, 0.45);
        .icon-container {
            background-color: rgba(230, 162, 60, 0.08);
            color: #e6a23c;
        }
    }

    &.active {
        border-color: #e6a23c;
        background: linear-gradient(
            135deg,
            rgba(230, 162, 60, 0.04) 0%,
            rgba(230, 162, 60, 0.01) 100%
        );
        box-shadow:
            0 10px 24px rgba(230, 162, 60, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);

        .icon-container {
            background: #e6a23c;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(230, 162, 60, 0.25);
        }

        .option-title {
            color: #d97706;
        }

        .selection-mark {
            background-color: #e6a23c;
            box-shadow: 0 2px 6px rgba(230, 162, 60, 0.35);
        }
    }
}

.visibility-card--private {
    &:not(.active):hover {
        border-color: rgba(245, 108, 108, 0.45);
        .icon-container {
            background-color: rgba(245, 108, 108, 0.08);
            color: #f56c6c;
        }
    }

    &.active {
        border-color: #f56c6c;
        background: linear-gradient(
            135deg,
            rgba(245, 108, 108, 0.04) 0%,
            rgba(245, 108, 108, 0.01) 100%
        );
        box-shadow:
            0 10px 24px rgba(245, 108, 108, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);

        .icon-container {
            background: #f56c6c;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(245, 108, 108, 0.25);
        }

        .option-title {
            color: #f56c6c;
        }

        .selection-mark {
            background-color: #f56c6c;
            box-shadow: 0 2px 6px rgba(245, 108, 108, 0.35);
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
    border-radius: 12px;
    background: rgba(17, 24, 39, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    color: #9ca3af;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    margin-bottom: 0.75rem;
    flex-shrink: 0;

    svg {
        width: 1.05rem;
        height: 1.05rem;
        transition: transform 0.3s ease;
    }

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
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

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
