<template>
    <img :src="imgURL" class="img" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
    img_index: number
}>()

const imgURL = computed(() => {
    if (props.img_index !== undefined) {
        const url = new URL(`../../assets/bg_imgs/${props.img_index}.jpg`, import.meta.url).href
        return url
    }
    return ''
})
</script>

<style scoped>
.img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
