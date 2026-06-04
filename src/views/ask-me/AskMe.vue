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
                title="我的提问箱"
                :search="showSearchAndSort"
                :has_sort_upvote="showSearchAndSort"
                :sort_and_search="showSearchAndSort"
                sidebar_btn
                get_keywords_url="/questions/inbox/keywords"
            />
        </template>

        <template #toolbar>
            <div class="tabs-container">
                <div class="tabs-wrapper">
                    <div
                        v-for="tab in tabs"
                        :key="tab.key"
                        :class="['tab-item', { active: activeTab === tab.key }]"
                        @click="activeTab = tab.key"
                    >
                        <span class="tab-label">{{ tab.label }}</span>
                        <div class="tab-indicator"></div>
                    </div>
                </div>
            </div>
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
                marginTop: index === 0 ? '16px' : '0',
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

const tabs = [
    { key: 'all', label: '全部提问' },
    { key: 'unanswered', label: '新的提问' },
    { key: 'answered', label: '已回答提问' },
    { key: 'top', label: '置顶提问' },
]

const activeTab = ref('all')
const loading = ref(false)

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()

// Hide search & sort if on 'top' list (consistent with previous behavior)
const showSearchAndSort = computed(() => activeTab.value !== 'top')

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
            const tag = activeTab.value === 'top' ? 'pinned' : activeTab.value
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
    () => activeTab.value,
    () => {
        Init()
        resetScrollPosition()
    },
)

onMounted(() => {
    Init()
})
</script>

<style scoped src="./AskMe.scss"></style>

<style scoped lang="scss">
.tabs-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 8px;
    padding: 0 16px;
    box-sizing: border-box;
}

.tabs-wrapper {
    display: flex;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    gap: 4px;
    z-index: 10;
}

.tab-item {
    position: relative;
    padding: 8px 16px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    &:hover {
        background: rgba(255, 255, 255, 0.25);
    }

    &.active {
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(72, 145, 224, 0.12);

        .tab-label {
            color: #4891e0;
            font-weight: 600;
        }

        .tab-indicator {
            transform: scaleX(1);
            opacity: 1;
        }
    }
}

.tab-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    transition: color 0.3s ease;
}

.tab-indicator {
    position: absolute;
    bottom: 2px;
    left: 16px;
    right: 16px;
    height: 3px;
    background: #4891e0;
    border-radius: 2px;
    transform: scaleX(0);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
