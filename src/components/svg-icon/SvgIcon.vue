<template>
    <svg
        :key="color_"
        :width="size"
        :height="size"
        aria-hidden="true"
        v-bind="$attrs"
        :color="color_"
        :fill="color_"
        ref="icon"
        @mouseover="color_ = hoverColor || color"
        @mouseout="color_ = color"
    >
        <use :href="`#icon-${iconName}`"></use>
    </svg>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

interface SvgIconProps {
    icon: string // 图标名称
    size?: number | string // 图标大小
    color?: string // 图标颜色
    filled?: boolean // 是否填充
    hoverColor?: string // 鼠标悬停颜色
}

const props = defineProps<SvgIconProps>()
const iconName = computed(() => (props.filled ? `${props.icon}-fill` : props.icon))
const color_ = ref(props.color)

watch(
    () => props.color,
    (newColor) => {
        color_.value = newColor
    },
)
</script>

<style scoped>
.icon {
    display: inline-block;
    vertical-align: middle;
}
</style>
