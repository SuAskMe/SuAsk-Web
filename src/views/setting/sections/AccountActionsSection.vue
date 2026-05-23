<template>
    <SettingSectionCard
        title="账号设置"
        description="涉及密码、登录态与注销操作，都会直接影响当前账号使用状态。"
        danger
    >
        <div class="password-logout">
            <p class="danger-option" @click="$emit('resetPassword')">
                <Lock class="danger-icon" /> 重置密码
            </p>
            <p class="danger-option" @click="$emit('logout')">
                <SwitchButton class="danger-icon" /> 退出登录
            </p>
            <p class="danger-option deactivate" @click="$emit('deactivate')">
                <WarningFilled class="danger-icon" /> 注销账号
            </p>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import { Lock, SwitchButton, WarningFilled } from '@element-plus/icons-vue'
import SettingSectionCard from './SettingSectionCard.vue'

defineEmits(['resetPassword', 'logout', 'deactivate'])
</script>

<style scoped lang="scss">
.password-logout {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.password-logout p {
    margin: 0;
}

.danger-option {
    font-size: 1em;
    color: #ff4d4f;
    cursor: pointer;
    padding: 0.5em 1em;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;

    &:hover {
        background-color: rgba(255, 77, 79, 0.1);
        font-weight: bold;
    }
}

.danger-icon {
    width: 1.2em;
    margin-right: 0.25em;
}
</style>
