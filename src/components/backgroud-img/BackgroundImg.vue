<template>
    <div :style="dynamicImg" />
</template>

<script setup lang="ts">
import { computed, defineProps, watch } from 'vue';

/*
    * 背景图片组件
    * props:
    * img_index?: 图片索引
    * img_url?: 图片链接
*/
const props = defineProps<{
    img_index?: number;
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

/*
    * 监听图片索引和图片链接的变化
    * 如果图片链接存在，则使用图片链接
    * 如果图片索引存在，则使用图片索引
    * 否则不显示背景图片
*/
watch(
    () => [props.img_index, props.img_url],
    ([newImgIndex, newImgUrl]) => {
        if (newImgUrl) {
            imgUrl = String(newImgUrl);
        } else if (newImgIndex !== undefined) {
            imgUrl = new URL(`../../assets/bg_imgs/${newImgIndex}.png`, import.meta.url).href;
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