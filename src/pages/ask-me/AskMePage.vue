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

        <div class="question-list-wrapper">
            <Transition :name="slideDirection" mode="out-in">
                <!-- 全部 -->
                <div v-if="activeTab === 'all'" key="all" class="question-list">
                    <template v-if="tabLists.all.length > 0">
                        <div
                            v-for="(question, index) in tabLists.all"
                            :key="question.id"
                            :class="[
                                'question-card',
                                {
                                    'status-answered': question.tag === '已回答',
                                    'status-unanswered': question.tag === '未回答',
                                    'status-pinned': question.is_pinned,
                                    'status-deleted': question.tag === '已删除',
                                },
                            ]"
                            :style="{
                                marginTop: index === 0 ? '16px' : '0',
                            }"
                            @click="navigateTo(question)"
                        >
                            <div class="question-info">
                                <div class="question-detail">
                                    <div class="question-title-row">
                                        <h3 class="question-title">{{ question.title }}</h3>
                                        <div class="question-status-badges" aria-label="提问状态">
                                            <span
                                                :class="[
                                                    'status-badge',
                                                    getQuestionStatusClass(question),
                                                ]"
                                            >
                                                {{ getQuestionStatusText(question) }}
                                            </span>
                                            <span
                                                v-if="showPinnedBadge(question)"
                                                class="status-badge pinned"
                                            >
                                                已置顶
                                            </span>
                                        </div>
                                    </div>
                                    <p class="question-summary">{{ question.contents }}</p>
                                    <CardMediaGrid
                                        v-if="question.image_urls && question.image_urls.length > 0"
                                        :image-urls="question.image_urls"
                                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                                    />
                                </div>
                            </div>
                            <div class="question-meta">
                                <div class="meta-details">
                                    <span class="meta-item">
                                        <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                        浏览：{{ question.views }}
                                    </span>
                                    <span class="meta-item time">
                                        {{ getTimeStr(question.created_at) }}
                                    </span>
                                </div>
                                <div class="question-actions">
                                    <button
                                        type="button"
                                        class="action-btn view"
                                        @click.stop="navigateTo(question)"
                                    >
                                        查看
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn pin"
                                        @click.stop="pin(question)"
                                    >
                                        {{ question.is_pinned ? '取消置顶' : '置顶' }}
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn delete"
                                        @click.stop="handleDelete(question)"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else-if="!loading" class="empty-state">
                        <el-empty description="暂无提问" />
                    </div>
                </div>
                <!-- 已回答 -->
                <div v-else-if="activeTab === 'answered'" key="answered" class="question-list">
                    <template v-if="tabLists.answered.length > 0">
                        <div
                            v-for="(question, index) in tabLists.answered"
                            :key="question.id"
                            :class="[
                                'question-card',
                                {
                                    'status-answered': question.tag === '已回答',
                                    'status-unanswered': question.tag === '未回答',
                                    'status-pinned': question.is_pinned,
                                    'status-deleted': question.tag === '已删除',
                                },
                            ]"
                            :style="{
                                marginTop: index === 0 ? '16px' : '0',
                            }"
                            @click="navigateTo(question)"
                        >
                            <div class="question-info">
                                <div class="question-detail">
                                    <div class="question-title-row">
                                        <h3 class="question-title">{{ question.title }}</h3>
                                        <div class="question-status-badges" aria-label="提问状态">
                                            <span
                                                :class="[
                                                    'status-badge',
                                                    getQuestionStatusClass(question),
                                                ]"
                                            >
                                                {{ getQuestionStatusText(question) }}
                                            </span>
                                            <span
                                                v-if="showPinnedBadge(question)"
                                                class="status-badge pinned"
                                            >
                                                已置顶
                                            </span>
                                        </div>
                                    </div>
                                    <p class="question-summary">{{ question.contents }}</p>
                                    <CardMediaGrid
                                        v-if="question.image_urls && question.image_urls.length > 0"
                                        :image-urls="question.image_urls"
                                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                                    />
                                </div>
                            </div>
                            <div class="question-meta">
                                <div class="meta-details">
                                    <span class="meta-item">
                                        <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                        浏览：{{ question.views }}
                                    </span>
                                    <span class="meta-item time">
                                        {{ getTimeStr(question.created_at) }}
                                    </span>
                                </div>
                                <div class="question-actions">
                                    <button
                                        type="button"
                                        class="action-btn view"
                                        @click.stop="navigateTo(question)"
                                    >
                                        查看
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn pin"
                                        @click.stop="pin(question)"
                                    >
                                        {{ question.is_pinned ? '取消置顶' : '置顶' }}
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn delete"
                                        @click.stop="handleDelete(question)"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else-if="!loading" class="empty-state">
                        <el-empty description="暂无提问" />
                    </div>
                </div>
                <!-- 未回答 -->
                <div v-else-if="activeTab === 'unanswered'" key="unanswered" class="question-list">
                    <template v-if="tabLists.unanswered.length > 0">
                        <div
                            v-for="(question, index) in tabLists.unanswered"
                            :key="question.id"
                            :class="[
                                'question-card',
                                {
                                    'status-answered': question.tag === '已回答',
                                    'status-unanswered': question.tag === '未回答',
                                    'status-pinned': question.is_pinned,
                                    'status-deleted': question.tag === '已删除',
                                },
                            ]"
                            :style="{
                                marginTop: index === 0 ? '16px' : '0',
                            }"
                            @click="navigateTo(question)"
                        >
                            <div class="question-info">
                                <div class="question-detail">
                                    <div class="question-title-row">
                                        <h3 class="question-title">{{ question.title }}</h3>
                                        <div class="question-status-badges" aria-label="提问状态">
                                            <span
                                                :class="[
                                                    'status-badge',
                                                    getQuestionStatusClass(question),
                                                ]"
                                            >
                                                {{ getQuestionStatusText(question) }}
                                            </span>
                                            <span
                                                v-if="showPinnedBadge(question)"
                                                class="status-badge pinned"
                                            >
                                                已置顶
                                            </span>
                                        </div>
                                    </div>
                                    <p class="question-summary">{{ question.contents }}</p>
                                    <CardMediaGrid
                                        v-if="question.image_urls && question.image_urls.length > 0"
                                        :image-urls="question.image_urls"
                                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                                    />
                                </div>
                            </div>
                            <div class="question-meta">
                                <div class="meta-details">
                                    <span class="meta-item">
                                        <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                        浏览：{{ question.views }}
                                    </span>
                                    <span class="meta-item time">
                                        {{ getTimeStr(question.created_at) }}
                                    </span>
                                </div>
                                <div class="question-actions">
                                    <button
                                        type="button"
                                        class="action-btn view"
                                        @click.stop="navigateTo(question)"
                                    >
                                        查看
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn pin"
                                        @click.stop="pin(question)"
                                    >
                                        {{ question.is_pinned ? '取消置顶' : '置顶' }}
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn delete"
                                        @click.stop="handleDelete(question)"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else-if="!loading" class="empty-state">
                        <el-empty description="暂无提问" />
                    </div>
                </div>
                <!-- 已置顶 -->
                <div v-else-if="activeTab === 'top'" key="top" class="question-list">
                    <template v-if="tabLists.top.length > 0">
                        <div
                            v-for="(question, index) in tabLists.top"
                            :key="question.id"
                            :class="[
                                'question-card',
                                {
                                    'status-answered': question.tag === '已回答',
                                    'status-unanswered': question.tag === '未回答',
                                    'status-pinned': question.is_pinned,
                                    'status-deleted': question.tag === '已删除',
                                },
                            ]"
                            :style="{
                                marginTop: index === 0 ? '16px' : '0',
                            }"
                            @click="navigateTo(question)"
                        >
                            <div class="question-info">
                                <div class="question-detail">
                                    <div class="question-title-row">
                                        <h3 class="question-title">{{ question.title }}</h3>
                                        <div class="question-status-badges" aria-label="提问状态">
                                            <span
                                                :class="[
                                                    'status-badge',
                                                    getQuestionStatusClass(question),
                                                ]"
                                            >
                                                {{ getQuestionStatusText(question) }}
                                            </span>
                                            <span
                                                v-if="showPinnedBadge(question)"
                                                class="status-badge pinned"
                                            >
                                                已置顶
                                            </span>
                                        </div>
                                    </div>
                                    <p class="question-summary">{{ question.contents }}</p>
                                    <CardMediaGrid
                                        v-if="question.image_urls && question.image_urls.length > 0"
                                        :image-urls="question.image_urls"
                                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                                    />
                                </div>
                            </div>
                            <div class="question-meta">
                                <div class="meta-details">
                                    <span class="meta-item">
                                        <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                        浏览：{{ question.views }}
                                    </span>
                                    <span class="meta-item time">
                                        {{ getTimeStr(question.created_at) }}
                                    </span>
                                </div>
                                <div class="question-actions">
                                    <button
                                        type="button"
                                        class="action-btn view"
                                        @click.stop="navigateTo(question)"
                                    >
                                        查看
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn pin"
                                        @click.stop="pin(question)"
                                    >
                                        {{ question.is_pinned ? '取消置顶' : '置顶' }}
                                    </button>
                                    <button
                                        v-if="question.tag !== '已删除'"
                                        type="button"
                                        class="action-btn delete"
                                        @click.stop="handleDelete(question)"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else-if="!loading" class="empty-state">
                        <el-empty description="暂无提问" />
                    </div>
                </div>
                <!-- 已删除 -->
                <div v-else-if="activeTab === 'deleted'" key="deleted" class="question-list">
                    <template v-if="tabLists.deleted.length > 0">
                        <div
                            v-for="(question, index) in tabLists.deleted"
                            :key="question.id"
                            :class="[
                                'question-card',
                                {
                                    'status-answered': question.tag === '已回答',
                                    'status-unanswered': question.tag === '未回答',
                                    'status-deleted': question.tag === '已删除',
                                },
                            ]"
                            :style="{
                                marginTop: index === 0 ? '16px' : '0',
                            }"
                            @click="navigateTo(question)"
                        >
                            <div class="question-info">
                                <div class="question-detail">
                                    <div class="question-title-row">
                                        <h3 class="question-title">{{ question.title }}</h3>
                                        <div class="question-status-badges" aria-label="提问状态">
                                            <span
                                                :class="[
                                                    'status-badge',
                                                    getQuestionStatusClass(question),
                                                ]"
                                            >
                                                {{ getQuestionStatusText(question) }}
                                            </span>
                                            <span
                                                v-if="showPinnedBadge(question)"
                                                class="status-badge pinned"
                                            >
                                                已置顶
                                            </span>
                                        </div>
                                    </div>
                                    <p class="question-summary">{{ question.contents }}</p>
                                    <CardMediaGrid
                                        v-if="question.image_urls && question.image_urls.length > 0"
                                        :image-urls="question.image_urls"
                                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                                    />
                                </div>
                            </div>
                            <div class="question-meta">
                                <div class="meta-details">
                                    <span class="meta-item">
                                        <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                        浏览：{{ question.views }}
                                    </span>
                                    <span class="meta-item time">
                                        {{ getTimeStr(question.created_at) }}
                                    </span>
                                </div>
                                <div class="question-actions">
                                    <button
                                        type="button"
                                        class="action-btn view"
                                        @click.stop="navigateTo(question)"
                                    >
                                        查看
                                    </button>
                                    <button
                                        type="button"
                                        class="action-btn restore"
                                        @click.stop="handleRestore(question)"
                                    >
                                        恢复
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else-if="!loading" class="empty-state">
                        <el-empty description="暂无提问" />
                    </div>
                </div>
            </Transition>
        </div>
    </QuestionListPage>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElMessageBox } from 'element-plus/es/components/message-box/index.mjs'
import CardMediaGrid from '@/shared/ui/card-media-grid'
import { getTimeStr } from '@/shared/lib/date-time'
import QuestionListPage, { useQuestionListPageShell } from '@/widgets/question-list-page'
import QuestionHeader from '@/widgets/question-header'
import { useQuestionDetailNavigation } from '@/features/question-detail-navigation'
import { useThemeBackgroundIndex } from '@/entities/user'
import {
    getQFMAllApi,
    pinQFMApi,
    searchQFMApi,
    type GetQFMRes,
    type QFMItem,
} from '@/entities/teacher-self'
import { deleteQuestionApi, restoreQuestionApi } from '@/entities/question'
import { usePagination, type PaginationParams } from '@/shared/lib/pagination'
import { SidebarStore } from '@/widgets/app-shell/model'
import { DeviceTypeStore } from '@/shared/model/device-type.store'
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

const { navigateTo: origNavigateTo } = useQuestionDetailNavigation(questionList)
const router = useRouter()

const navigateTo = (question: QFMItem) => {
    if (!question) return
    const index = questionList.findIndex((q) => q.id === question.id)
    if (index !== -1) {
        origNavigateTo(index)
    } else {
        router.push({
            path: `/question-detail/${question.id}`,
        })
    }
}

const getQuestionStatusText = (question: QFMItem) => {
    if (question.tag === '已删除') return '已删除'
    if (question.tag === '已回答') return '已回答'
    return '未回答'
}

const getQuestionStatusClass = (question: QFMItem) => {
    if (question.tag === '已删除') return 'deleted'
    if (question.tag === '已回答') return 'answered'
    return 'unanswered'
}

const showPinnedBadge = (question: QFMItem) => question.is_pinned && question.tag !== '已删除'

// Store separate lists for each tab to prevent double rendering and card drifting during transitions
const tabLists = reactive<Record<string, QFMItem[]>>({
    all: [],
    answered: [],
    unanswered: [],
    top: [],
    deleted: [],
})

watch(
    questionList,
    (newList) => {
        tabLists[activeTab.value] = [...newList]
    },
    { deep: true, immediate: true },
)

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

const pin = async (question: QFMItem) => {
    if (!question) return
    const res = await pinQFMApi({ question_id: question.id })
    if (res) {
        question.is_pinned = res.is_pinned
        const idx = questionList.findIndex((q) => q.id === question.id)
        if (idx !== -1) {
            questionList[idx].is_pinned = res.is_pinned
        }
    } else {
        ElMessage.error('请求失败')
    }
}

const handleDelete = async (question: QFMItem) => {
    if (!question) return
    try {
        await ElMessageBox.confirm(
            `确定要删除提问“${question.title}”吗？删除后该问题将移入已删除箱。`,
            '确认删除',
            {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning',
            },
        )
    } catch {
        return
    }

    loading.value = true
    try {
        await deleteQuestionApi(question.id)
        ElMessage.success('删除提问成功')
        await refresh(sort_type)
        resetScrollPosition()
    } catch {
        ElMessage.error('删除提问失败')
    } finally {
        loading.value = false
    }
}

const handleRestore = async (question: QFMItem) => {
    if (!question) return
    try {
        await ElMessageBox.confirm(
            `确定要恢复提问“${question.title}”吗？恢复后它会重新出现在正常列表中。`,
            '恢复确认',
            {
                confirmButtonText: '确认恢复',
                cancelButtonText: '取消',
                type: 'warning',
            },
        )
    } catch {
        return
    }

    loading.value = true
    try {
        await restoreQuestionApi(question.id)
        ElMessage.success('恢复提问成功')
        await refresh(sort_type)
        resetScrollPosition()
    } catch {
        ElMessage.error('恢复提问失败')
    } finally {
        loading.value = false
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

<style scoped src="./styles/AskMe.scss"></style>

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

.question-list-wrapper {
    position: relative;
    width: 100%;
    min-height: 400px;
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
</style>
