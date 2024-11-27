<template>
    <div class="footer">

        <el-input class="search" v-model="searchText" placeholder="请输入..." allow-clear />

        <svg-icon icon="image" color="#71B6FF" size="30px" />
        <svg-icon icon="link" color="#71B6FF" size="30px" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const searchText = ref(''); // 搜索内容
</script>

<style scoped lang="scss">
.footer {
    display: flex;
    align-items: center;
    height: 60px;
    gap: 20px;
    padding-right: 20px;

    .search {
        width: 100%;
        height: 30px;
        border-radius: 50px;
        --el-input-border-radius: 15px !important;
    }
}
</style>