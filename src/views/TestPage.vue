<template>
    <div>
        <el-button @click="hello">Test</el-button>
    </div>
</template>

<script setup lang="ts">
import request from '@/utils/http/request'

function hello() {
    request.get('/hello')
}
</script>

<style></style>
