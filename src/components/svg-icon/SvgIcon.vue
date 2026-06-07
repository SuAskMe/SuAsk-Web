<template>
    <SharedSvgIcon v-bind="$props" />
</template>

<script setup lang="ts">
import SharedSvgIcon from '@/shared/ui/svg-icon'

interface SvgIconProps {
    icon: string
    size?: number | string
    color?: string
    filled?: boolean
    hoverColor?: string
}

defineProps<SvgIconProps>()
</script>
