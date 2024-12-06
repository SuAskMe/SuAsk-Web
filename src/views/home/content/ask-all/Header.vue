<template>
    <div class="header">
        <div class="sort-and-search">
            <el-dropdown v-if="!showInput" class="header-item">
                <span class="dropdown">
                    {{ sortText[sortIndex] }}
                    <svg-icon icon="sort-down" color="#71B6FF" size="22px" />
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            v-for="(item, index) in sortText"
                            :key="index"
                            @click="changeSort(index)"
                        >
                            {{ item }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div class="header-item">
                <div class="search">
                    <el-autocomplete
                        v-if="showInput"
                        v-model="searchText"
                        placeholder="搜索问题"
                    ></el-autocomplete>
                    <div class="search-icon" @click.stop="searchBtn">
                        <svg-icon
                            icon="search"
                            :color="showInput ? '#71B6FF' : '#808080'"
                            size="22px"
                        />
                    </div>
                    <div
                        v-if="showInput"
                        class="cancel-btn"
                        @click.stop="searchBtn"
                    >
                        取消
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { el } from "element-plus/es/locales.mjs";
import { computed, inject, ref } from "vue";

// 排序组件
const sortText = ref(["按时间降序", "按时间升序", "按热度降序", "按热度升序"]);
const sortIndex = ref(0);
function changeSort(index: number) {
    sortIndex.value = index;
}

// 搜索组件
const showInput = ref(false);
function searchBtn() {
    showInput.value = !showInput.value;
}
const searchText = ref(""); // 搜索内容
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    margin-left: auto;
    gap: 10px;

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

        .search {
            width: fit-content;
            display: flex;
            align-items: center;
            gap: 5px;

            .search-icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;

                &:hover {
                    background-color: $su-blue-light;
                }
            }

            .cancel-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: small;
                cursor: pointer;
                color: $su-grey;

                &:hover {
                    color: $su-blue-light;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.header-item .search .el-autocomplete {
    width: 300px;
    .el-input {
        --el-input-border-radius: var(--el-border-radius-round);
        .el-input__wrapper {
            padding: 0px 15px;
        }
    }
}
</style>
