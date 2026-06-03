<script setup lang="ts">
import { computed } from 'vue'
import { ElImage } from 'element-plus/es/components/image/index.mjs'
import 'element-plus/es/components/image/style/css'
import { getImgStyle, getVisibleImageUrls } from '../bubble-card'

const props = defineProps<{
    imageUrls?: string[]
    width?: string
}>()

// 布局和预览共用同一份图片列表，保证缩略图数量和预览轮播一致。
// 这样一旦出现“显示 8 张但预览能翻到更多”的问题，排查范围会小很多。
const visibleImages = computed(() => getVisibleImageUrls(props.imageUrls))
const imageContainer = computed(() => getImgStyle(visibleImages.value, props.width))
</script>

<template>
    <div v-if="imageContainer.hasImages" class="photos-container">
        <div
            class="preview-group"
            :style="{
                width: imageContainer.containerWidth,
                gap: imageContainer.gap + ' ' + imageContainer.gap,
            }"
        >
            <el-image
                v-for="(img, index) in visibleImages"
                :key="img"
                :src="img"
                :style="{
                    width: imageContainer.size,
                    height: imageContainer.size,
                    borderRadius: '6px',
                }"
                :preview-src-list="visibleImages"
                :initial-index="index"
                fit="cover"
                lazy
                infinite
                preview-teleported
                style="cursor: zoom-in"
                @click.stop
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.photos-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.preview-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
</style>
