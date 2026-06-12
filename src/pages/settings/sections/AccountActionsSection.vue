<template>
    <SettingSectionCard
        title="账号设置"
        description="管理您的账户安全、登录状态或进行账户注销操作。"
        :icon="icon"
        danger
    >
        <div class="account-actions-container">
            <div class="action-list">
                <div v-if="!isGuest" class="action-item" @click="$emit('resetPassword')">
                    <div class="action-item-left">
                        <component :is="Lock" class="action-icon" />
                        <span class="action-title">重置密码</span>
                    </div>
                    <component :is="ArrowRight" class="arrow-icon" />
                </div>
                <div class="action-item" @click="$emit('logout')">
                    <div class="action-item-left">
                        <component :is="SwitchButton" class="action-icon" />
                        <span class="action-title">退出登录</span>
                    </div>
                    <component :is="ArrowRight" class="arrow-icon" />
                </div>
            </div>

            <template v-if="!isGuest">
                <div class="danger-zone-divider"></div>

                <div class="danger-zone-panel">
                    <div class="danger-zone-header">
                        <component :is="WarningFilled" class="danger-header-icon" />
                        <div class="danger-header-text">
                            <h4 class="danger-title">敏感操作区域</h4>
                            <p class="danger-desc">
                                请谨慎操作，注销账户将永久清除您的账号信息，此操作不可恢复。
                            </p>
                        </div>
                    </div>
                    <button class="deactivate-btn" @click="$emit('deactivate')">注销账号</button>
                </div>
            </template>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import { Lock, SwitchButton, WarningFilled, ArrowRight } from '@element-plus/icons-vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    icon?: string
    isGuest?: boolean
}>()

defineEmits(['resetPassword', 'logout', 'deactivate'])
</script>

<style scoped lang="scss">
.account-actions-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.action-list {
    display: flex;
    flex-direction: column;
    background-color: #f8fafc;
    border-radius: 12px;
    border: 1px solid rgba(17, 24, 39, 0.04);
    overflow: hidden;
}

.action-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1.25rem;
    cursor: pointer;
    background-color: #ffffff;
    transition: all 0.25s ease;
    border-bottom: 1px solid rgba(17, 24, 39, 0.04);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: rgba(113, 182, 255, 0.04);

        .action-icon {
            color: #71b6ff;
            transform: scale(1.05);
        }

        .action-title {
            color: #111827;
        }

        .arrow-icon {
            transform: translateX(3px);
            color: #71b6ff;
        }
    }
}

.action-item-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.action-icon {
    width: 1.2rem;
    height: 1.2rem;
    color: #6b7280;
    transition: all 0.25s ease;
}

.action-title {
    font-size: 0.95rem;
    font-weight: 500;
    color: #374151;
    transition: color 0.25s ease;
}

.arrow-icon {
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
    transition: all 0.25s ease;
}

.danger-zone-divider {
    height: 1px;
    background-color: rgba(17, 24, 39, 0.06);
    margin: 0.25rem 0;
}

.danger-zone-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.15rem;
    background-color: rgba(239, 68, 68, 0.03);
    border: 1px dashed rgba(239, 68, 68, 0.2);
    border-radius: 12px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
}

.danger-zone-header {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
}

.danger-header-icon {
    width: 1.4rem;
    height: 1.4rem;
    color: #ef4444;
    margin-top: 0.15rem;
    flex-shrink: 0;
}

.danger-header-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.danger-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #ef4444;
}

.danger-desc {
    margin: 0;
    font-size: 0.85rem;
    color: #7f8fa4;
    line-height: 1.4;
}

.deactivate-btn {
    align-self: center;
    flex-shrink: 0;
    height: 38px;
    padding: 0 1.25rem;
    border-radius: 8px;
    background-color: #ef4444;
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

    @media (max-width: 768px) {
        width: 100%;
        height: 42px;
    }

    &:hover {
        background-color: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(239, 68, 68, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
}
</style>
