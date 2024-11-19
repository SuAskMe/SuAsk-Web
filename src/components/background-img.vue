<template>
    <div :style="dynamicImg" />
</template>

<script setup lang="ts">
import { computed, defineProps, watch } from 'vue';

const props = defineProps<{
    img_index?: string;
    img_url?: string;
}>();

let imgUrl = '';

const dynamicImg = computed(() => {
    return {
        background: `center/cover url(${imgUrl})`,
        height: '100%',
        width: '100%'
    };
});

watch(
    () => [props.img_index, props.img_url],
    ([newImgIndex, newImgUrl]) => {
        if (newImgUrl) {
            imgUrl = String(newImgUrl);
        } else if (newImgIndex !== undefined) {
            imgUrl = new URL(`../assets/bg_imgs/${newImgIndex}.png`, import.meta.url).href;
        } else {
            imgUrl = '';
        }
    },
    { immediate: true }
);
</script>

<style scoped>
.img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>