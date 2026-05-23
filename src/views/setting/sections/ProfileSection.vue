<template>
    <SettingSectionCard
        title="基础信息"
        description="维护昵称、简介和头像，公开展示时会优先使用这里的资料。"
        :icon="icon"
    >
        <div>
            <div v-if="isGuest" class="guest-warning-banner">
                <div class="warning-icon-wrap">
                    <svg-icon icon="settings" color="#e6a23c" size="18px" />
                </div>
                <div class="warning-message">
                    临时用户无法修改个人信息，请先升级为正式账号
                </div>
            </div>
            <div class="profile-section">
                <div class="profile-section__fields">
                    <div class="field-group">
                        <label class="field-label">昵称</label>
                        <input
                            v-model="basicInfo.nickname"
                            placeholder="请输入昵称"
                            :disabled="isGuest"
                            class="su-input"
                        />
                    </div>
                    <div class="field-group">
                        <label class="field-label">简介</label>
                        <BioPanel v-model="basicInfo.introduction" :disabled="isGuest" />
                    </div>
                </div>
                <div class="profile-section__aside">
                    <div class="avatar-container">
                        <div
                            class="avatar-hover-wrapper"
                            :class="{ 'is-disabled': isGuest }"
                            @click="!isGuest && imgPicker?.click()"
                        >
                            <div class="avatar-inner">
                                <img
                                    :src="avatarUrl || defaultAvatar"
                                    class="avatar-img"
                                    @error="onAvatarError"
                                    alt="用户头像"
                                />
                                <div v-if="!isGuest" class="avatar-overlay">
                                    <svg-icon icon="camera-lens" color="#ffffff" size="22px" />
                                    <span class="overlay-text">修改头像</span>
                                </div>
                            </div>
                        </div>
                        <input
                            ref="imgPicker"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            style="display: none"
                            @change="$emit('pick-image', $event)"
                        />
                        <div class="user-badge">
                            <span class="badge-prefix">ID</span>
                            <span class="badge-name">@{{ basicInfo.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import { ref, type Component } from 'vue'
import BioPanel from '@/components/bio-panel/BioPanel.vue'
import SettingSectionCard from './SettingSectionCard.vue'
import defaultAvatar from '@/assets/default-avatar.png'

defineProps<{
    isGuest: boolean
    basicInfo: {
        name: string
        nickname: string
        introduction: string
    }
    avatarUrl: string
    icon?: string
}>()

defineEmits(['pick-image'])

const imgPicker = ref<HTMLInputElement>()

const onAvatarError = (e: Event) => {
    const target = e.target as HTMLImageElement
    target.src = defaultAvatar
}
</script>

<style scoped lang="scss">
.guest-warning-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1.25rem;
    border-radius: 12px;
    background-color: rgba(230, 162, 60, 0.08);
    border: 1px solid rgba(230, 162, 60, 0.25);
    margin-bottom: 1.5rem;
    color: #e6a23c;
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.4;

    .warning-icon-wrap {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
}

.profile-section {
    display: flex;
    justify-content: space-between;
    gap: 2.5rem;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        gap: 1.5rem;
    }
}

.profile-section__fields {
    flex: 1;
}

.profile-section__aside {
    width: 35%;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
        width: 100%;
    }
}

.avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.avatar-hover-wrapper {
    position: relative;
    cursor: pointer;
    border-radius: 50%;
    padding: 4px;
    background: linear-gradient(135deg, rgba(113, 182, 255, 0.4), rgba(72, 145, 224, 0.15));
    box-shadow: 0 8px 24px rgba(113, 182, 255, 0.12);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);

    &:hover:not(.is-disabled) {
        transform: translateY(-4px);
        background: linear-gradient(135deg, #71b6ff, #4891e0);
        box-shadow: 0 12px 30px rgba(113, 182, 255, 0.25);

        .avatar-overlay {
            opacity: 1;
        }

        .avatar-img {
            transform: scale(0.95);
            filter: brightness(0.75) blur(1px);
        }
    }

    &.is-disabled {
        cursor: not-allowed;
        background: #f1f5f9;
        box-shadow: none;
    }
}

.avatar-inner {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #ffffff;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    background-color: rgba(15, 23, 42, 0.45);
    opacity: 0;
    transition: opacity 0.35s ease;
    border-radius: 50%;

    .overlay-text {
        color: #ffffff;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
}

.user-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.85rem;
    background-color: #f1f5f9;
    border-radius: 20px;
    font-size: 0.85rem;
    color: #475569;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

    .badge-prefix {
        font-size: 0.75rem;
        font-weight: 700;
        color: #71b6ff;
        margin-right: 0.35rem;
        padding-right: 0.35rem;
        border-right: 1px solid #cbd5e1;
    }
    
    .badge-name {
        letter-spacing: 0.2px;
    }
}

.field-group {
    margin-bottom: 1.5rem;

    .field-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.6rem;
    }
}

.su-input {
    width: 100%;
    height: 42px;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    border: 1px solid rgba(17, 24, 39, 0.08);
    border-radius: 10px;
    color: #1f2937;
    font-size: 0.95rem;
    font-weight: 500;
    outline: none;
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

    &::placeholder {
        color: #9ca3af;
    }

    &:hover:not(:disabled) {
        border-color: rgba(113, 182, 255, 0.6);
        background-color: #fafcff;
    }

    &:focus:not(:disabled) {
        border-color: #71b6ff;
        background-color: #ffffff;
        box-shadow: 0 0 0 4px rgba(113, 182, 255, 0.15);
    }

    &:disabled {
        background-color: #f3f4f6;
        border-color: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
    }
}
</style>

