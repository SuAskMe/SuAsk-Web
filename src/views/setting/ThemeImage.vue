<template>
    <div class="theme-images-container">
        <div
            v-for="(src, index) in src"
            :key="src"
            class="theme-image-wrapper"
            :class="{ selected: selectIndex - 1 == index }"
            @click="selectImg(index)"
        >
            <img class="theme-image" :src="src" :width="width" :alt="`主题 ${index + 1}`" />
            <div class="selection-indicator">
                <i class="el-icon-check"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    src: string[]
    width: string
}>()

const selectIndex = defineModel<number>({ default: 1 })
const selectImg = (index: number) => {
    selectIndex.value = index + 1
}
</script>

<style lang="scss" scoped>
.theme-images-container {
    display: flex;
    gap: 1rem;
    flex-wrap: nowrap;
}

.theme-image-wrapper {
    position: relative;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    &.selected {
        outline: 2px solid $su-blue;
        transform: translateY(-3px);
        box-shadow: 0 6px 14px rgba(113, 182, 255, 0.35);

        .selection-indicator {
            opacity: 1;
        }
    }

    .theme-image {
        border-radius: 10px;
        display: block;
        object-fit: cover;
        width: 100%;
        height: auto;
    }

    .selection-indicator {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background-color: $su-blue;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0;
        transition: all 0.3s ease;
        font-size: 12px;

        i {
            font-size: 12px;
        }
    }
}
</style>
