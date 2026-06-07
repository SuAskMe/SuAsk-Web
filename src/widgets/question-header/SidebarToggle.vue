<template>
    <div class="sidebar-toggle" @click.stop="$emit('toggle')">
        <svg-icon icon="sidebar" color="#71B6FF" size="25px" :filled="sidebarStore.IsOpen" />
    </div>
</template>

<script setup lang="ts">
import { SidebarStore } from '@/app/store/modules/sidebar'

defineEmits(['toggle'])

const sidebarStore = SidebarStore()
</script>

<style scoped lang="scss">
.sidebar-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
</style>
