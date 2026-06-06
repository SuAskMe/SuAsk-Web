<template>
    <div @click="handleClick" class="control-item" :class="{ 'control-item-active': clicked }">
        <svg-icon
            v-if="icon"
            :icon="props.icon"
            :color="clicked ? 'var(--su-blue)' : 'var(--su-grey)'"
            :size="size ? size : '22px'"
            :filled="clicked"
        />
        <div v-if="text" style="padding-left: 14px"></div>
        <p v-if="text" :class="{ text: !clicked, 'text-clicked': clicked }">{{ text }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ControlPanelStore } from '@/store/modules/control-panel'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { SidebarStore } from '@/store/modules/sidebar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const controlPanelStore = ControlPanelStore()
const sidebarStore = SidebarStore()
const deviceTypeStore = DeviceTypeStore()

const props = defineProps<{
    id: string
    icon?: string
    size?: string
    text?: string
    jumpToPath: string
}>()

const router = useRouter()

const clicked = computed(() => controlPanelStore.getSelectedItem() == props.id)

const handleClick = () => {
    controlPanelStore.setSelectedItem(props.id)
    if (deviceTypeStore.isMobile) {
        sidebarStore.close()
    }
    router.push(props.jumpToPath)
}
</script>

<style scoped lang="scss">
.control-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 40px;
    padding: 0 12px;
    border-radius: 8px;
    transition: var(--su-transition-smooth);
    color: var(--su-text-secondary);
    text-decoration: none;
    background: transparent;
    width: 100%;

    &:hover {
        background-color: var(--su-bg-hover);
        color: var(--su-text-primary);
    }
}

.control-item-active {
    background-color: rgba(113, 182, 255, 0.12) !important;
    color: var(--su-blue) !important;
    font-weight: 600;
}

.text {
    line-height: normal;
    font-size: 15px;
    transition: var(--su-transition-smooth);
}

.text-clicked {
    line-height: normal;
    font-size: 15px;
    color: var(--su-blue);
    font-weight: 600;
    transition: var(--su-transition-smooth);
}
</style>
