<template>
    <SettingSectionCard
        title="通知设置"
        description="控制邮件提醒是否启用，以及通知发送到哪个邮箱。"
        :icon="icon"
    >
        <div class="notification-settings">
            <div class="field-group">
                <label class="field-label">邮件通知开关</label>
                <div class="switch-container">
                    <span class="switch-label">
                        {{ settings.notifySwitch ? '已启用邮件通知' : '邮件通知已关闭' }}
                    </span>
                    <el-switch
                        v-model="settings.notifySwitch"
                        active-text="开启"
                        inactive-text="关闭"
                        :active-color="'#4CAF50'"
                        :inactive-color="'#dcdfe6'"
                    />
                </div>
            </div>

            <div class="field-group email-setting">
                <label class="field-label">通知邮箱地址</label>
                <input
                    v-model="settings.notifyEmail"
                    type="email"
                    placeholder="请输入接收通知的邮箱地址"
                    :disabled="!settings.notifySwitch"
                    class="su-input"
                />
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    settings: {
        notifySwitch: boolean
        notifyEmail: string
    }
    icon?: string
}>()
</script>

<style scoped lang="scss">
.notification-settings .field-group {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 12px;
    padding: 1.2rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(113, 182, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    overflow: hidden;
}

.notification-settings .field-group::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: $su-blue;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.notification-settings .field-group:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(113, 182, 255, 0.1);
    border-color: rgba(113, 182, 255, 0.25);
}

.notification-settings .field-group:hover::before {
    opacity: 1;
}

.notification-settings .field-label {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
}

.notification-settings .field-label::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(45deg, $su-blue, #4caf50);
    margin-right: 0.6rem;
    box-shadow: 0 2px 4px rgba(113, 182, 255, 0.3);
}

.switch-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 10px;
    border: 1px solid rgba(113, 182, 255, 0.15);
    transition: all 0.3s ease;
    max-width: 500px;
}

.switch-container:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(113, 182, 255, 0.3);
}

.switch-label {
    font-size: 0.9rem;
    color: #4b5563;
    font-weight: 500;
}

.email-setting {
    background: linear-gradient(135deg, #fffcf6 0%, #ffffff 100%);
    border-color: rgba(255, 152, 0, 0.15);
}

.email-setting:hover {
    border-color: rgba(255, 152, 0, 0.35);
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.08);
}

.email-setting::before {
    background: linear-gradient(180deg, #ff9800, #f57c00);
}

.email-setting .field-label::before {
    background: linear-gradient(45deg, #ff9800, #f57c00);
    box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
}

.su-input {
    width: 100%;
    max-width: 500px;
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
        border-color: rgba(255, 152, 0, 0.5);
        background-color: #fffdfa;
    }

    &:focus:not(:disabled) {
        border-color: #ff9800;
        background-color: #ffffff;
        box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.15);
    }

    &:disabled {
        background-color: #f3f4f6;
        border-color: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
    }
}
</style>

