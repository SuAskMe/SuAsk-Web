<template>
    <svg :width="size" :height="size" aria-hidden="true" v-bind="$attrs" :color="color" :fill="color">
        <use :href="`#icon-${iconName}`"></use>
    </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface SvgIconProps {
    icon: string;
    size?: number | string;
    color?: string;
    filled?: boolean;
}

const props = defineProps<SvgIconProps>();
const iconName = computed(() => (props.filled ? `${props.icon}-filled` : props.icon));
</script>

<style scoped>
.icon {
    display: inline-block;
    vertical-align: middle;
}
</style>
