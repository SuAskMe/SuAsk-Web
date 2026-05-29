<template>
    <div class="theme-images-container">
        <button
            v-for="themeIndex in themeIndexes"
            :key="themeIndex"
            type="button"
            class="theme-image-wrapper"
            :class="{ selected: selectIndex === themeIndex }"
            :aria-pressed="selectIndex === themeIndex"
            :title="`主题 ${themeIndex}`"
            @click="selectImg(themeIndex)"
            :style="{ width: width }"
        >
            <BackgroundImg class="theme-image" :img_index="themeIndex" />
            <div class="selection-indicator">
                <component :is="Check" class="check-icon" />
            </div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { computed } from 'vue'
import BackgroundImg from '@/components/background-img'

const props = withDefaults(defineProps<{
    width: string
    count?: number
}>(), {
    count: 5,
})

const selectIndex = defineModel<number>({ default: 1 })

const themeIndexes = computed(() =>
    Array.from({ length: props.count }, (_, index) => index + 1),
)

const selectImg = (themeIndex: number) => {
    selectIndex.value = themeIndex
}
</script>

<style lang="scss" scoped>
.theme-images-container {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
}

.theme-image-wrapper {
    position: relative;
    cursor: pointer;
    aspect-ratio: 4 / 3;
    border: 0;
    border-radius: 12px;
    overflow: hidden;
    padding: 0;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-width: calc((100% - 3.75rem) / 4);
    background-color: #f1f5f9;

    @media screen and (max-width: 768px) {
        max-width: calc((100% - 1.25rem) / 2);
    }

    &:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        
        .theme-image {
            filter: saturate(1.06);
        }
    }

    &.selected {
        outline: 3px solid $su-blue;
        outline-offset: -3px;
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 10px 24px rgba(113, 182, 255, 0.3);

        .selection-indicator {
            opacity: 1;
            transform: scale(1);
        }
    }

    .theme-image {
        border-radius: 10px;
        display: block;
        width: 100%;
        height: 100%;
        transition: all 0.4s ease;
    }

    .selection-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        background-color: $su-blue;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0.6);
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 2px 8px rgba(113, 182, 255, 0.5);

        .check-icon {
            width: 14px;
            height: 14px;
            color: #ffffff;
            stroke: #ffffff;
            stroke-width: 2;
        }
    }
}
</style>
