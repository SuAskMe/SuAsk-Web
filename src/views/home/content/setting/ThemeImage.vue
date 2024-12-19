<template>
    <div v-for="(src, index) in src" :key="src">
        <img :class="{ select: selectIndex == index }" class="theme-image" @click="selectImg(index)" :src="src"
            :width="width" />
    </div>
</template>

<script setup lang='ts'>

defineProps<{
    src: string[];
    width: string;
}>();

const selectIndex = defineModel()
const selectImg = (index: number) => {
    selectIndex.value = index
}
</script>

<style lang="scss" scoped>
.theme-image {
    border-radius: 10px;
}

.select {
    outline: 3px solid $su-blue;
}
</style>