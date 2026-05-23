<script setup lang="ts">
import SvgIcon from '@/components/svg-icon'

withDefaults(
    defineProps<{
        views: number
        timeLabel: string
        tag?: string
        tagStyle?: Record<string, string>
        showFavorite?: boolean
        isFavorite?: boolean
    }>(),
    {
        tag: undefined,
        tagStyle: undefined,
        showFavorite: false,
        isFavorite: false,
    },
)

defineEmits(['favorite'])
</script>

<template>
    <div class="meta-row">
        <div v-if="tag !== undefined" class="tag" :style="tagStyle">
            {{ tag }}
        </div>
        <div class="looks">
            <SvgIcon icon="eye" size="16" color="#818181" />
            <span class="counts">{{ views }}</span>
        </div>
        <div class="time">{{ timeLabel }}</div>
        <svg
            v-if="showFavorite"
            :width="18"
            :height="18"
            :fill="isFavorite ? '#FFC107' : '#808080'"
            :class="isFavorite ? '' : 'icon'"
            style="cursor: pointer"
            @click.stop="$emit('favorite')"
        >
            <use :href="`#icon-bookmark${isFavorite ? '-fill' : ''}`"></use>
        </svg>
    </div>
</template>

<style scoped lang="scss">
.meta-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    gap: 16px;
}

.tag {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 0px 4px 1px 4px;
}

.looks {
    display: flex;
    align-items: center;
}

.counts {
    font-size: 12px;
    color: #818181;
    margin-left: 5px;
}

.time {
    font-size: 12px;
    color: #818181;
}

.icon:hover {
    fill: #71b6ff;
}
</style>
