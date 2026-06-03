<template>
    <div class="avatar-and-id" @click="$emit('openProfile')">
        <UserAvatar :src="avatar" :name="nickname" :size="120" />
        <div class="user-name">
            <span>{{ nickname }}</span>
        </div>
        <div class="user-id">
            <span>@{{ name }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserAvatar } from '@/components/user-avatar'

defineProps<{
    avatar?: string | null
    nickname: string
    name: string
}>()

defineEmits(['openProfile'])
</script>

<style scoped lang="scss">
.avatar-and-id {
    padding: 0 15%;
}

:deep(.user-avatar) {
    cursor: pointer;
    transition: transform 0.3s ease;
}

:deep(.user-avatar:hover) {
    transform: scale(1.1);
}

.user-name {
    cursor: pointer;
    text-align: left;
    font-size: 25px;
    font-weight: bold;
    margin-top: 10px;
}

.user-name:hover {
    text-decoration: underline;
}

.user-id {
    cursor: pointer;
    text-align: left;
    font-size: 13px;
    color: var(--su-text-muted);
    margin-top: 10px;
}
</style>
