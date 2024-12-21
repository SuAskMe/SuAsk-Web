<template>
    <div class="img-container">
        <img class="img" v-for="(img, index) in imgSliceList" :key="index" :src="URL.createObjectURL(img)" alt="img"
            :style="{ right: `${index * 10}px`, zIndex: index }" />
        <el-tag v-if="imgList.imgList.length != 0" class="count" type="primary" size="small">{{ imgList.imgList.length
            }}</el-tag>
    </div>
</template>

<script setup lang='ts'>
const imgList = defineProps<{
    imgList: Blob[];
}>();

const imgSliceList: Blob[] = imgList.imgList.slice(0, 3);

const URL = window.URL || window.webkitURL;

</script>

<style scoped lang="scss">
.img-container {
    display: flex;
    flex-direction: row;
    height: 100px;
    position: relative;

    .img {
        position: absolute;
        top: 0;
        width: 100px;
        height: 100px;
        aspect-ratio: 1/1;
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