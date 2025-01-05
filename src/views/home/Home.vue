<template>
    <div class="main">
    </div>
</template>

<script setup lang='ts'>
import { UserStore } from '@/store/modules/user';
import { computed } from 'vue';

const store = UserStore()


</script>

<style scoped lang="scss">
.main {
    display: flex;
}
</style>