<template>
    <svg :width="size" :height="size" aria-hidden="true" v-bind="$attrs" :color="color" :fill="color">
        <use :href="`#icon-${iconName}`"></use>
    </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface SvgIconProps {
    icon: string; // 图标名称
    size?: number | string; // 图标大小
    color?: string; // 图标颜色
    filled?: boolean; // 是否填充
}

const props = defineProps<SvgIconProps>();
const iconName = computed(() => (props.filled ? `${props.icon}-fill` : props.icon));
</script>

<style scoped>
.icon {
    display: inline-block;
    vertical-align: middle;
}
</style>
