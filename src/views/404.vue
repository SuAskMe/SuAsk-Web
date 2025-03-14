<template>
    <div class="main-container" @click="navigateToHome">
        <div class="404-text">
            <h1>该页面不存在呢QAQ</h1>
            <h3>404 NotFound</h3>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToHome() {
    router.replace({ name: 'Root' })
}
</script>

<style scoped>
.main-container {
    display: flex;
    justify-content: center;
    text-align: center;
    height: 100lvh;

    @media screen and (max-width: 768px) {
        align-items: center;
    }
}
</style>
