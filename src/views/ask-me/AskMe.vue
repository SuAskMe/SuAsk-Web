<template>
    <QuestionListPage
        ref="listPage"
        :img-index="bg_img_index"
        :loading="loading"
        @reach-bottom="handleReachBottom"
    >
        <template #header>
            <QuestionHeader
                @change-sort="changeSort"
                @search="search"
                @cancel-search="cancelSearch"
                @sidebar="sidebar"
                :title="title"
                :search="showSearchAndSort"
                :has_sort_upvote="showSearchAndSort"
                :sort_and_search="showSearchAndSort"
                sidebar_btn
                get_keywords_url="/questions/inbox/keywords"
            />
        </template>
        <BubbleCard
            v-for="(question, index) in questionList"
            :key="question.id"
            :title="question.title"
            :text="question.contents"
            :views="question.views"
            :time-stamp="question.created_at"
            :image-urls="question.image_urls"
            :is-pinned="question.is_pinned"
            :bubble-key="index"
            :tag="question.tag"
            show-pin
            :style="{
                marginTop: index === 0 ? '24px' : '0',
            }"
            :width="deviceType.isMobile ? '80vw' : '45vw'"
            :click-card="navigateTo"
            :click-pin="pin"
        ></BubbleCard>
    </QuestionListPage>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { BubbleCard } from '@/components/bubble-card'
import QuestionListPage from '@/components/question-list-page'
import QuestionHeader from '@/components/question-header'
import { useQuestionDetailNavigation } from '@/composables/useQuestionDetailNavigation'
import { useQuestionListPageShell } from '@/composables/useQuestionListPageShell'
import { useThemeBackgroundIndex } from '@/composables/useThemeBackgroundIndex'
import { getQFMAllApi, pinQFMApi, searchQFMApi } from '@/api/question/teacher-self.api'
import { usePagination, type PaginationParams } from '@/utils/pagination'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
import type { QFMItem, GetQFMRes } from '@/model/teacher-self.model'

interface AskMeProps {
    type?: string // 'all' | 'answered' | 'unanswered' | 'top'
}

const props = withDefaults(defineProps<AskMeProps>(), {
    type: 'all',
})

const loading = ref(false)

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()

// Page title based on props.type
const title = computed(() => {
    switch (props.type) {
        case 'unanswered':
            return '新的提问'
        case 'answered':
            return '已回答提问'
        case 'top':
            return '置顶提问'
        default:
            return '我的提问箱'
    }
})

// Hide search & sort if on 'top' list (consistent with previous behavior)
const showSearchAndSort = computed(() => props.type !== 'top')

// Instantiate pagination locally within the component
const {
    data: questionList,
    init: InitStatus,
    loadMore: getNextQuestions,
    search: onSearch,
    cancelSearch: onCancelSearch,
    refresh,
} = usePagination<QFMItem>({
    fetchData: async (params: PaginationParams) => {
        let res: GetQFMRes
        if (params.keyword) {
            res = await searchQFMApi({
                keyword: params.keyword,
                sort_type: params.sort_type,
                page: params.page,
            })
        } else {
            const tag = props.type === 'top' ? 'pinned' : props.type
            res = await getQFMAllApi({
                sort_type: params.sort_type,
                page: params.page,
                tag: tag,
            })
        }
        return res
    },
})

const { navigateTo } = useQuestionDetailNavigation(questionList)

const Init = async () => {
    InitStatus()
    loading.value = true
    await getNextQuestions(0)
    loading.value = false
}

const handleReachBottom = async () => {
    if (loading.value === false) {
        loading.value = true
        await getNextQuestions()
        loading.value = false
    }
}

const sidebarStore = SidebarStore()

const sidebar = () => {
    sidebarStore.toggle()
}

let sort_type = 0

const changeSort = async (sortType: number) => {
    if (sort_type === sortType) {
        return
    }
    sort_type = sortType
    loading.value = true
    await refresh(sortType)
    resetScrollPosition()
    loading.value = false
}

const search = async (keyword: string) => {
    loading.value = true
    await onSearch(keyword)
    resetScrollPosition()
    loading.value = false
}

const cancelSearch = async () => {
    loading.value = true
    await onCancelSearch()
    resetScrollPosition()
    loading.value = false
}

const pin = async (key: number) => {
    key = Number(key)
    const res = await pinQFMApi({ question_id: questionList[key].id })
    if (res) {
        questionList[key].is_pinned = res.is_pinned
    } else {
        ElMessage.error('请求失败')
    }
}

watch(
    () => props.type,
    () => {
        Init()
    },
)

onMounted(() => {
    Init()
})
</script>

<style scoped src="./AskMe.scss"></style>
