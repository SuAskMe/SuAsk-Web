<template>
    <SettingSectionCard
        title="账号升级"
        description="您当前为临时用户，升级为正式账号后可解锁头像、昵称、通知等完整功能。"
    >
        <div class="guest-upgrade-notice">
            <div class="guest-upgrade-notice__panel">
                <span class="guest-upgrade-notice__hint">
                    请点击侧边栏中的「登录以获取全部功能」继续升级。
                </span>
            </div>
        </div>
    </SettingSectionCard>
</template>

<script setup lang="ts">
import SettingSectionCard from './SettingSectionCard.vue'
</script>

<style scoped lang="scss">
.guest-upgrade-notice__panel {
    display: flex;
    align-items: center;
    min-height: 84px;
    padding: 1rem 1.1rem;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(113, 182, 255, 0.08), rgba(72, 145, 224, 0.04));
    border: 1px dashed rgba(113, 182, 255, 0.35);
}

.guest-upgrade-notice__hint {
    color: #64748b;
    line-height: 1.7;
}
</style>
