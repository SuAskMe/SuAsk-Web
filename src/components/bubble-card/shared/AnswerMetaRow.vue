<script setup lang="ts">
import SvgIcon from '@/shared/ui/svg-icon'

withDefaults(
    defineProps<{
        likeCount: number
        timeLabel: string
        isLiked?: boolean
        showDelete?: boolean
    }>(),
    {
        isLiked: false,
        showDelete: false,
    },
)

defineEmits(['like', 'delete'])
</script>

<template>
    <div class="ans-footer">
        <div class="looks">
            <div
                class="like"
                :data-tips="isLiked ? '取消点赞' : '点赞'"
                @click.stop="$emit('like')"
            >
                <SvgIcon
                    icon="heart"
                    size="16"
                    :color="isLiked ? '#FF5F96' : '#818181'"
                    :filled="isLiked"
                />
            </div>
            <span class="counts">{{ likeCount }}</span>
        </div>

        <div class="time">{{ timeLabel }}</div>
    </div>
</template>

<style scoped lang="scss">
.ans-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.looks {
    display: flex;
    align-items: center;
    margin-right: 16px;
}

.like {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.like:hover::after {
    content: attr(data-tips);
    position: absolute;
    font-size: 12px;
    white-space: nowrap;
    top: -30%;
    right: 120%;
    padding: 2px;
    background-color: #fff;
    border: #66b0ff solid 1px;
    color: #66b0ff;
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
</style>
