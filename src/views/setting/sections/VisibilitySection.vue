<template>
    <SettingSectionCard
        title="提问箱可见性"
        description="控制其他用户访问当前提问箱时，看到的是公开、登录后可见还是完全关闭。"
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
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import { Lock, TurnOff, View } from '@element-plus/icons-vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    modelValue: string
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
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5em;
    margin: 0 auto;
    padding: 0.5em;
}

.visibility-card {
    position: relative;
    width: calc((100% - 4em) / 3);
    max-width: 300px;
    min-height: 160px;
    border-radius: 14px;
    background: linear-gradient(145deg, #ffffff, #f8f8f8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
    overflow: hidden;
    border: 2px solid transparent;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        width: 100%;
        max-width: 768px;
    }

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.09);
    }

    &.active {
        border-color: $su-blue;
        box-shadow: 0 8px 20px rgba(113, 182, 255, 0.25);
        background: linear-gradient(165deg, rgba(113, 182, 255, 0.05), rgba(113, 182, 255, 0.12));
        transform: translateY(-6px) scale(1.02);
    }
}

.card-content {
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
}

.icon-container {
    width: 2em;
    height: 2em;
    padding: 0.5em;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8em;
    color: #a0a0a0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.visibility-card.active .icon-container {
    background: $su-blue;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(113, 182, 255, 0.4);
}

.option-title {
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25em;
    transition: color 0.3s ease;
}

.visibility-card.active .option-title {
    color: $su-blue;
}

.option-desc {
    margin: 0;
    font-size: 0.9em;
    color: #606266;
    line-height: 1.5;
}
</style>
