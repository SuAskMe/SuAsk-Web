<template>
    <SettingSectionCard
        title="基础信息"
        description="维护昵称、简介和头像，公开展示时会优先使用这里的资料。"
    >
        <el-alert
            v-if="isGuest"
            type="warning"
            title="临时用户无法修改个人信息，请先升级为正式账号"
            show-icon
            :closable="false"
            style="margin-bottom: 16px"
        />
        <div class="profile-section">
            <div class="profile-section__fields">
                <div class="field-group">
                    <label>昵称</label>
                    <el-input
                        v-model="basicInfo.nickname"
                        placeholder="请输入昵称"
                        :disabled="isGuest"
                    />
                </div>
                <div class="field-group">
                    <label>简介</label>
                    <BioPanel v-model="basicInfo.introduction" :disabled="isGuest" />
                </div>
            </div>
            <div class="profile-section__aside">
                <div class="avatar-container">
                    <div class="avatar">
                        <el-avatar :size="150" :src="avatarUrl">
                            <img src="@/assets/default-avatar.png" />
                        </el-avatar>
                        <input
                            ref="imgPicker"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            style="display: none"
                            @change="$emit('pick-image', $event)"
                        />
                        <el-button
                            v-if="!isGuest"
                            class="upload-btn"
                            type="primary"
                            size="small"
                            @click.stop="imgPicker?.click()"
                        >
                            <template #icon>
                                <svg-icon icon="edit" color="#ffffff" />
                            </template>
                            编辑
                        </el-button>
                    </div>
                    <p class="id">@{{ basicInfo.name }}</p>
                </div>
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BioPanel from '@/components/bio-panel/BioPanel.vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    isGuest: boolean
    basicInfo: {
        name: string
        nickname: string
        introduction: string
    }
    avatarUrl: string
}>()

defineEmits(['pick-image'])

const imgPicker = ref<HTMLInputElement>()
</script>

<style scoped lang="scss">
.profile-section {
    display: flex;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
    }
}

.profile-section__fields {
    flex: 1;
}

.profile-section__aside {
    width: 40%;
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
}

.avatar {
    position: relative;
    margin-bottom: 1rem;
}

.avatar :deep(.el-avatar) {
    border: 3px solid white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.avatar :deep(.el-avatar:hover) {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.upload-btn {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    border-radius: 20px;
}

.id {
    font-size: 1.1rem;
    color: $su-grey;
    font-weight: 500;
}

.field-group {
    margin-bottom: 1.2rem;
}

.field-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #606266;
    margin-bottom: 0.5rem;
}
</style>
