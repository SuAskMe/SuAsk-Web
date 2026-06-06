<template>
    <div class="guest-login-hint">
        <div class="guest-login-btn" @click="$emit('upgrade')">
            <svg-icon
                icon="arrow-left"
                color="#71B6FF"
                size="14px"
                style="transform: rotate(180deg); margin-right: 6px"
            />
            <span>登录以获取全部功能</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits(['upgrade'])
</script>

<style scoped lang="scss">
.guest-login-hint {
    padding: 0 15%;
    margin-top: 12px;
}

.guest-login-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 13px;
    color: #909399;
    transition: color 0.2s ease;
    padding: 4px 0;

    &:hover {
        color: #71b6ff;
    }
}
</style>
