<template>
    <SettingSectionCard
        title="通知设置"
        description="控制邮件提醒是否启用，以及通知发送到哪个邮箱。"
    >
        <div class="notification-settings">
            <div class="field-group">
                <label>邮件通知开关</label>
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
                <label>通知邮箱地址</label>
                <el-input
                    v-model="settings.notifyEmail"
                    placeholder="请输入接收通知的邮箱地址"
                    :disabled="!settings.notifySwitch"
                    clearable
                />
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import SettingSectionCard from './SettingSectionCard.vue'

defineProps<{
    settings: {
        notifySwitch: boolean
        notifyEmail: string
    }
}>()
</script>

<style scoped lang="scss">
.notification-settings .field-group {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 12px;
    padding: 1em;
    margin-bottom: 0.7em;
    border: 1px solid rgba(113, 182, 255, 0.1);
    transition: all 0.3s ease;
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
    box-shadow: 0 8px 25px rgba(113, 182, 255, 0.15);
    border-color: rgba(113, 182, 255, 0.3);
}

.notification-settings .field-group:hover::before {
    opacity: 1;
}

.notification-settings label {
    display: flex;
    align-items: center;
    font-size: 1em;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5em;
}

.notification-settings label::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(45deg, $su-blue, #4caf50);
    margin-right: 0.75rem;
    box-shadow: 0 2px 4px rgba(113, 182, 255, 0.3);
}

.switch-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.35em 0.75em;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    border: 1px solid rgba(113, 182, 255, 0.2);
    transition: all 0.3s ease;
    max-width: 500px;
}

.switch-container:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(113, 182, 255, 0.4);
}

.switch-label {
    font-size: 0.9rem;
    color: #606266;
    font-weight: 500;
}

.email-setting {
    background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
    border-color: rgba(255, 152, 0, 0.2);
}

.email-setting:hover {
    border-color: rgba(255, 152, 0, 0.4);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.15);
}

.email-setting::before {
    background: linear-gradient(180deg, #ff9800, #f57c00);
}

.email-setting label::before {
    background: linear-gradient(45deg, #ff9800, #f57c00);
    box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
}
</style>
