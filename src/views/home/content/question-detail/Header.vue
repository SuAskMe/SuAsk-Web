<template>
    <div class="header">
        <div class="return-btn" @click.stop="$emit('return')">
            <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
        </div>
        <!-- <div class="title">{{ title }}</div> -->
        <div class="sort-and-search">
            <el-dropdown class="header-item">
                <span class="dropdown">
                    {{ sortText[sortIndex] }}
                    <svg-icon icon="sort-down" color="#71B6FF" size="22px" />
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, index) in sortText" :key="index" @click="changeSort(index)">
                            {{ item }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface HeaderProps {
    title: string;
}

const props = defineProps<HeaderProps>();

const emit = defineEmits(["changeSort", "return"]);

// 排序组件
const sortText = ref(["按时间降序", "按时间升序", "按热度降序", "按热度升序"]);
const sortIndex = ref(0);
function changeSort(index: number) {
    sortIndex.value = index;
    emit("changeSort", index);
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
    user-select: none;

    .return-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .title {
        color: $su-blue-dark;
        font-weight: bold;
    }

    .sort-and-search {
        display: flex;
        align-items: center;
        margin-left: auto;
        gap: 12px;
    }

    .header-item {
        display: flex;
        align-items: center;

        .dropdown {
            cursor: pointer;
            color: $su-grey;
            display: flex;
            align-items: center;
            user-select: none;

            &:focus-visible {
                outline: none;
            }
        }
    }
}
</style>

<style lang="scss"></style>
