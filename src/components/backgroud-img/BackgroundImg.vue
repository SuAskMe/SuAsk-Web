<template>
    <img :src="imgURL" class="img" />
</template>

<script setup lang="ts">
import { computed, defineProps, watch } from 'vue';
const props = defineProps<{
    img_index: number;
}>();

console.log('img_index:', props.img_index); // 调试代码

const imgURL = computed(() => {
    if (props.img_index !== undefined) {
        const url = new URL(`../../assets/bg_imgs/${props.img_index}.png`, import.meta.url).href;
        return url;
    }
    return '';
});

</script>

<style scoped>
.img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>