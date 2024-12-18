<template>
    <div class="header">
        <div @click="back" class="back-button">
            <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
        </div>
    </div>
</template>

<script setup lang="ts">
function back() {
    history.back();
}
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    margin-left: auto;
    gap: 10px;
    border-bottom: 1px solid $su-border;

    .back-button {
        height: 30px;
        margin-left: 15px;
    }
}
</style>
