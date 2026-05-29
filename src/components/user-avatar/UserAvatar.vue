<template>
    <img
        v-if="src && !imgError"
        class="user-avatar user-avatar--img"
        :src="src"
        :alt="alt"
        :style="avatarStyle"
        @error="imgError = true"
    />
    <div
        v-else
        class="user-avatar user-avatar--fallback"
        :style="avatarStyle"
    >
        {{ fallbackChar }}
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        /** 头像 URL，为空时显示字母 fallback */
        src?: string | null
        /** alt 文本 */
        alt?: string
        /** 用于生成 fallback 字母的名称 */
        name?: string
        /** 头像尺寸，默认 38px */
        size?: number | string
    }>(),
    {
        src: '',
        alt: '',
        name: '',
        size: 38,
    },
)

const imgError = ref(false)

// src 变化时重置错误状态
watch(() => props.src, () => {
    imgError.value = false
})

const avatarStyle = computed(() => {
    const s = typeof props.size === 'number' ? `${props.size}px` : props.size
    return { width: s, height: s, fontSize: `${parseInt(String(props.size)) * 0.4}px` }
})

const fallbackChar = computed(() => {
    return props.name ? props.name.charAt(0).toUpperCase() : '?'
})
</script>

<style scoped lang="scss">
@use "sass:color";

.user-avatar {
    border-radius: 50%;
    flex-shrink: 0;

    &--img {
        object-fit: cover;
    }

    &--fallback {
        background: linear-gradient(135deg, $su-blue, color.adjust($su-blue, $lightness: 15%));
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }
}
</style>
