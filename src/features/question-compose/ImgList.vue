<template>
    <div class="img-container">
        <img
            class="img"
            v-for="img in previewImages"
            :key="img.url"
            :src="img.url"
            alt="img"
            :style="{ right: `${img.index * 10}px`, zIndex: img.index }"
        />
        <el-tag v-if="props.imgList.length !== 0" class="count" type="primary" size="small">
            {{ props.imgList.length }}
        </el-tag>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { createObjectUrlPreview, revokeObjectUrlPreviews } from './objectUrlPreviews'
import { ElTag } from 'element-plus/es/components/tag/index.mjs'
import 'element-plus/es/components/tag/style/css'

const props = defineProps<{
    imgList: Blob[]
}>()

const previewImages = ref<{ index: number; url: string }[]>([])

watch(
    () => props.imgList,
    (imgList) => {
        revokeObjectUrlPreviews(previewImages.value)
        previewImages.value = imgList.slice(0, 3).map((img, index) => ({
            ...createObjectUrlPreview(img, index),
            index,
        }))
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    revokeObjectUrlPreviews(previewImages.value)
})
</script>

<style scoped lang="scss">
.img-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    position: relative;
    width: 100%;

    .img {
        position: absolute;
        top: 0;
        height: 100%;
        width: auto;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 15%;
        border: solid 2px white;
        background-color: white;
        cursor: pointer;
    }

    .count {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 4;
    }
}
</style>
