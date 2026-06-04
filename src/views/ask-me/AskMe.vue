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
                        {{ tab.label }}
                    </div>
                </div>
            </div>
        </template>

        <Transition name="fade">
            <div v-if="questionList.length === 0 && !loading" class="empty-state">
                <el-empty description="暂无提问" />
            </div>
        </Transition>

        <Transition :name="slideDirection" mode="out-in">
            <div :key="listKey" class="question-list">
                <BubbleCard
                    v-for="(question, index) in questionList"
                    :key="question.id"
                    :class="[
                        'teacher-question-card',
                        {
                            'status-answered': question.tag === '已回答',
                            'status-unanswered': question.tag === '未回答',
                            'status-pinned': question.is_pinned && activeTab !== 'deleted',
                            'status-deleted': question.tag === '已删除',
                        },
                    ]"
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
            </div>
        </Transition>
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
import { ElEmpty } from 'element-plus/es/components/empty/index.mjs'
import 'element-plus/es/components/empty/style/css'

const tabs = [
    { key: 'all', label: '全部' },
    { key: 'answered', label: '已回答' },
    { key: 'unanswered', label: '未回答' },
    { key: 'top', label: '已置顶' },
    { key: 'deleted', label: '已删除' },
]

const activeTab = ref('all')
const loading = ref(false)

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()

// Hide search & sort if on 'top' or 'deleted' list (consistent with previous behavior)
const showSearchAndSort = computed(() => activeTab.value !== 'top' && activeTab.value !== 'deleted')

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

const tabOrder = ['all', 'answered', 'unanswered', 'top', 'deleted']
const slideDirection = ref('slide-left')
const listKey = ref(0)

watch(
    () => activeTab.value,
    (newVal, oldVal) => {
        const oldIndex = tabOrder.indexOf(oldVal || 'all')
        const newIndex = tabOrder.indexOf(newVal)
        slideDirection.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
        listKey.value++

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
    gap: 4px;
    padding: 4px;
    background: #f0f2f5;
    border-radius: 20px;
}

.tab-item {
    padding: 6px 18px;
    border: none;
    border-radius: 16px;
    background: transparent;
    font-size: 13px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #1e293b;
    }

    &.active {
        background: #fff;
        color: #4891e0;
        font-weight: 600;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
}

.question-list {
    min-height: 100px;
    position: relative;
    overflow: hidden;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

// ==================== 问题侧边状态颜色条 (内容管理风格) ====================
.teacher-question-card {
    :deep(.card-container) {
        position: relative;
        padding-left: 28px !important;

        &::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 28px;
            border-radius: 2px;
            background: transparent;
            transition: all 0.25s ease;
        }
    }

    &.status-answered :deep(.card-container)::before {
        background: #10b981; // 已回答: 绿色
    }

    &.status-unanswered :deep(.card-container)::before {
        background: #f59e0b; // 未回答: 橙色
    }

    // 置顶状态拥有最高优先级配色
    &.status-pinned :deep(.card-container)::before {
        background: #ffc107; // 置顶: 金黄色
    }

    // 已删除状态配色 (红色)
    &.status-deleted :deep(.card-container)::before {
        background: #ef4444; // 已删除: 红色
    }
}

// 空状态淡入
.fade-enter-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-leave-to {
    opacity: 0;
}

// 左滑出（切换到右侧标签页时）
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.35s ease;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(40px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-40px);
}

.slide-left-leave-active {
    position: absolute;
    width: 100%;
}

// 右滑出（切换到左侧标签页时）
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.35s ease;
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-40px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(40px);
}

.slide-right-leave-active {
    position: absolute;
    width: 100%;
}
</style>
