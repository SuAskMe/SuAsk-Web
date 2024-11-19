<template>
    <img :src="imgUrl" alt="background_img" />
</template>

<script setup lang="ts">
import { defineProps, watch } from 'vue';

const props = defineProps<{
    img_index?: number;
    img_url?: string;
}>();


let imgUrl = '';


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

<style scoped></style>