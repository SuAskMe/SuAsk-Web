<script setup lang="ts">
import SvgIcon from '@/shared/ui/svg-icon'
import { UserAvatar } from '@/shared/ui/user-avatar'

withDefaults(
    defineProps<{
        answerNum?: number
        avatars?: string[]
        showFavorite?: boolean
        isFavorite?: boolean
        showDelete?: boolean
    }>(),
    {
        answerNum: 0,
        avatars: () => [],
        showFavorite: true,
        isFavorite: false,
        showDelete: false,
    },
)

defineEmits(['favorite', 'delete', 'footer'])
</script>

<template>
    <!-- 底部模式只由 answerNum 决定，避免“有回答”和“待回答”两种状态同时渲染一半。 -->
    <div v-if="answerNum && answerNum > 0" class="card-footer">
        <UserAvatar
            v-for="(avatar, index) in avatars"
            :key="index"
            :src="avatar"
            :size="32"
            :style="{
                marginLeft: index === 0 ? '16px' : '-14px',
                zIndex: 10 - index,
            }"
            class="avatar"
        />
        <div class="text">{{ answerNum }} 个回答</div>

        <div
            v-if="showFavorite"
            class="favorite"
            :data-tips="isFavorite ? '取消收藏' : '收藏'"
            @click.stop="$emit('favorite')"
        >
            <SvgIcon
                icon="bookmark"
                size="24"
                :color="isFavorite ? '#FFC107' : '#66b0ff'"
                :filled="isFavorite"
            />
        </div>
    </div>
    <div v-else class="card-footer">
        <SvgIcon class="msg-icon" icon="communicate_message" size="24" color="#66b0ff" />
        <div class="text" @click.stop="$emit('footer')">发表一个回答...</div>

        <div
            v-if="showFavorite"
            class="favorite"
            :data-tips="isFavorite ? '取消收藏' : '收藏'"
            @click.stop="$emit('favorite')"
        >
            <SvgIcon
                icon="bookmark"
                size="24"
                :color="isFavorite ? '#FFC107' : '#66b0ff'"
                :filled="isFavorite"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.card-footer {
    width: 100%;
    height: 42px;
    border-top: $su-border solid 1px;
    display: flex;
    align-items: center;
    padding-bottom: 5px;
}

.avatar {
    border: solid 2px #fff;
}

.msg-icon {
    margin-left: 16px;
}

.text {
    margin-left: 12px;
    color: #66b0ff;
}

.favorite {
    position: relative;
    margin-left: auto;
    margin-right: 16px;
    margin-top: 5px;
    cursor: pointer;
}

.favorite:hover::after {
    content: attr(data-tips);
    position: absolute;
    font-size: 12px;
    white-space: nowrap;
    top: -50%;
    left: 100%;
    padding: 2px;
    background-color: #fff;
    border: #66b0ff solid 1px;
    color: #66b0ff;
}
</style>
