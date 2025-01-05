<template>
    <div class="header">
        <div v-if="return_btn" class="return-btn" @click.stop="$emit('return')">
            <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
        </div>
        <div v-if="props.title" class="title">{{ props.title }}</div>
        <div v-if="props.sort_and_search" class="sort-and-search">
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
            <div v-if="props.search" class="header-item">
                <div class="search">
                    <el-autocomplete
                        v-if="showInput"
                        v-model="searchText"
                        placeholder="搜索问题"
                        :fetch-suggestions="querySearch"
                        :debounce="100"
                        :trigger-on-focus="false"
                        clearable
                    ></el-autocomplete>
                    <div class="search-icon" @click.stop="search">
                        <svg-icon
                            icon="search"
                            :color="showInput ? '#71B6FF' : '#808080'"
                            size="22px"
                        />
                    </div>
                    <div
                        v-if="showInput"
                        class="cancel-btn"
                        @click.stop="cancelSearch"
                    >
                        取消
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GetKeywordReq, GetKeywordRes } from "@/model/question.model";
import request from "@/utils/http/request";
import { da } from "element-plus/es/locales.mjs";
import { computed, ref } from "vue";
const emit = defineEmits(["changeSort", "search", "cancelSearch", "return"]);

const props = withDefaults(
    defineProps<{
        title?: string;
        get_keywords_url?: string;
        return_btn?: boolean;
        search?: boolean;
        has_sort_upvote?: boolean;
        defualt_sort_type?: number;
        sort_and_search?: boolean;
        teacher_id?: number;
    }>(),
    {
        defualt_sort_type: 0,
    }
);

// 排序组件
const sortTextCommon = ref([
    "按时间降序",
    "按时间升序",
    "按热度降序",
    "按热度升序",
]);
const sortTextWithoutUpvote = ref(["按时间降序", "按时间升序"]);
const sortText = computed(() => {
    return props.has_sort_upvote
        ? sortTextCommon.value
        : sortTextWithoutUpvote.value;
});
const sortIndex = ref(props.defualt_sort_type);
function changeSort(index: number) {
    sortIndex.value = index;
    emit("changeSort", index);
}

// 搜索组件
const showInput = ref(false);
const searchText = ref(""); // 搜索内容

async function querySearch(queryString: string, cb: any) {
    if (queryString.length === 0) {
        return;
    }
    const results = await getKeyWords({
        keyword: queryString,
        sort_type: sortIndex.value,
        teacher_id: props.teacher_id,
    });
    // console.log(results);
    if (results) {
        // console.log(results.words);
        cb(results.words);
    } else {
        cb([]);
    }
}

const search = () => {
    if (
        showInput.value &&
        searchText.value.length > 0 &&
        searchText.value.trim() !== ""
    ) {
        emit("search", searchText.value);
    } else {
        showInput.value = true;
    }
};

const cancelSearch = () => {
    showInput.value = false;
    searchText.value = "";
    emit("cancelSearch");
};

async function getKeyWords(data: GetKeywordReq): Promise<GetKeywordRes> {
    // console.log(data);

    if (!props.get_keywords_url) {
        return Promise.reject("url is not defined");
    }
    return request
        .get(props.get_keywords_url, { params: data })
        .then((res) => {
            // console.log(res);
            if (res) {
                return res.data;
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
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
            gap: 5px;

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
