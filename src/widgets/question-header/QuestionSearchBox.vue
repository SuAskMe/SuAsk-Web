<template>
    <div class="header-item">
        <div class="search">
            <el-autocomplete
                v-if="showInput"
                v-model="searchText"
                placeholder="搜索问题"
                :fetch-suggestions="querySearch"
                :debounce="100"
                :trigger-on-focus="false"
                :style="mobile ? 'width: 65vw' : 'width: 300px'"
                clearable
            />
            <div class="search-icon" @click.stop="clickSearch">
                <svg-icon icon="search" :color="showInput ? '#71B6FF' : '#808080'" size="22px" />
            </div>
            <div v-if="showInput" class="cancel-btn" @click.stop="cancelSearch">取消</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GetKeywordReq, GetKeywordRes } from '@/entities/question'
import request from '@/shared/api/request'
import { ref } from 'vue'

const props = withDefaults(
    defineProps<{
        getKeywordsUrl?: string
        teacherId?: number
        sortType?: number
        mobile?: boolean
    }>(),
    {
        getKeywordsUrl: '',
        teacherId: undefined,
        sortType: 0,
        mobile: false,
    },
)

const emit = defineEmits(['search', 'cancelSearch', 'update:active'])

const showInput = ref(false)
const searchText = ref('')
let searchRecord = false

const setActive = (value: boolean) => {
    showInput.value = value
    emit('update:active', value)
}

async function querySearch(queryString: string, cb: (results: unknown[]) => void) {
    if (queryString.length < 2) {
        cb([])
        return
    }
    const results = await getKeywords({
        keyword: queryString,
        sort_type: props.sortType,
        teacher_id: props.teacherId,
    })
    cb(results?.words || [])
}

const clickSearch = () => {
    searchText.value = searchText.value.trim()
    if (showInput.value && searchText.value.length >= 2) {
        searchRecord = true
        emit('search', searchText.value)
        return
    }
    setActive(true)
}

const cancelSearch = () => {
    setActive(false)
    searchText.value = ''
    if (searchRecord) {
        searchRecord = false
        emit('cancelSearch')
    }
}

async function getKeywords(data: GetKeywordReq): Promise<GetKeywordRes> {
    if (!props.getKeywordsUrl) {
        return Promise.reject('url is not defined')
    }
    return request
        .get(props.getKeywordsUrl, { params: data })
        .then((res) => {
            if (res) {
                return res.data
            }
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}
</script>

<style scoped lang="scss">
.header-item {
    display: flex;
    align-items: center;
}

.search {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 5px;
}

.search-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
}

.cancel-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: small;
    word-break: keep-all;
    cursor: pointer;
    color: $su-grey;

    &:hover {
        color: $su-blue-light;
    }
}
</style>

<style lang="scss">
.header-item .search .el-autocomplete {
    .el-input {
        --el-input-border-radius: var(--el-border-radius-round);

        .el-input__wrapper {
            padding: 0px 15px;
        }
    }
}
</style>
