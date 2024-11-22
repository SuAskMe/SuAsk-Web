<template>
    <div class="main">
        <div style="margin-top: 20dvh;">
            <img alt="SuAsk" src="@/assets/logo.svg" :width="isMobile ? '150px' : '200px'">
        </div>
        <p :class="isMobile ? 'title-phone' : 'title-web'">SuAsk • 速问</p>
        <Typewriter :isMobile="isMobile" @click="jumpToLogin" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Typewriter from './TypeWriter.vue';
import { router } from '@/router';

const isMobile = ref(false);

function _isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

function jumpToLogin() {
    router.push('/login');
}

onMounted(() => {
    isMobile.value = _isMobile();
    localStorage.setItem('isMobile', JSON.stringify(isMobile.value));
});
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
        color: #71B6FF;
    }

    .title-phone {
        font-size: 4dvh;
        font-weight: bold;
        color: #71B6FF;
    }
}
</style>