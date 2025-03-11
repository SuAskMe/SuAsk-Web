<template>
    <div class="main" @click="jumpToLogin">
        <div style="margin-top: 20dvh">
            <img alt="SuAsk" src="@/assets/logo.svg" :width="isMobile ? '150px' : '200px'" />
        </div>
        <p :class="isMobile ? 'title-phone' : 'title-web'">SuAsk • 速问</p>
        <Typewriter :isMobile="isMobile" />
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Typewriter from './TypeWriter.vue'
import { router } from '@/router'

const isMobile = !(inject('deviceType', 'desktop') == 'desktop')

function jumpToLogin() {
    router.push('/login')
}
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100dvh;

    .title-web {
        font-size: 5dvh;
        font-weight: bold;
        color: #71b6ff;
    }

    .title-phone {
        font-size: 4dvh;
        font-weight: bold;
        color: #71b6ff;
    }
}
</style>
