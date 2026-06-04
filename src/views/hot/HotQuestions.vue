<template>
    <QuestionListPage
        ref="listPage"
        class="hot-page"
        :img-index="bg_img_index"
        :loading="loading"
        :border-top="false"
        scroll-mask
        @reach-bottom="handleReachBottom"
    >
        <template #header>
            <div class="hot-header-bar">
                <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
                <div class="hot-title">
                    <p>热点问题</p>
                </div>
            </div>
        </template>
        <template #toolbar>
            <div class="hot-filter">
                <div class="search-bar">
                    <div class="search-wrapper">
                        <svg-icon icon="search" color="#999" size="18px" class="search-icon" />
                        <input
                            v-model="searchKeyword"
                            type="text"
                            placeholder="搜索问题标题..."
                            @keyup.enter="handleSearch"
                            class="search-native-input"
                        />
                        <span v-if="searchKeyword" class="search-clear" @click="handleCancelSearch"
                            >&times;</span
                        >
                    </div>
                </div>
                <div class="time-filter">
                    <div class="time-tabs">
                        <button
                            v-for="opt in timeOptions"
                            :key="opt.value"
                            :class="['time-tab', { active: timeRange === opt.value }]"
                            @click="handleTimeRangeChange(opt.value)"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>
            </div>
        </template>
        <Transition name="fade">
            <div v-if="timeRangeLists[timeRange].length === 0 && !loading" class="empty-state">
                <el-empty description="暂无热点问题" />
            </div>
        </Transition>
        <div class="question-list-wrapper">
            <Transition :name="slideDirection" mode="out-in">
                <!-- 全部 -->
                <div v-if="timeRange === 'all'" key="all" class="question-list">
                    <BubbleCard
                        v-for="(question, index) in timeRangeLists.all"
                        :id="`question-${question.id}`"
                        :key="question.id"
                        :title="question.title"
                        :text="question.contents"
                        :views="question.views"
                        :time-stamp="question.created_at"
                        :image-urls="question.image_urls"
                        :bubble-key="index"
                        :click-card="navigateTo"
                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                        :style="{
                            marginTop: index === 0 ? '16px' : '0',
                        }"
                    />
                </div>
                <!-- 本周 -->
                <div v-else-if="timeRange === 'week'" key="week" class="question-list">
                    <BubbleCard
                        v-for="(question, index) in timeRangeLists.week"
                        :id="`question-${question.id}`"
                        :key="question.id"
                        :title="question.title"
                        :text="question.contents"
                        :views="question.views"
                        :time-stamp="question.created_at"
                        :image-urls="question.image_urls"
                        :bubble-key="index"
                        :click-card="navigateTo"
                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                        :style="{
                            marginTop: index === 0 ? '16px' : '0',
                        }"
                    />
                </div>
                <!-- 本月 -->
                <div v-else-if="timeRange === 'month'" key="month" class="question-list">
                    <BubbleCard
                        v-for="(question, index) in timeRangeLists.month"
                        :id="`question-${question.id}`"
                        :key="question.id"
                        :title="question.title"
                        :text="question.contents"
                        :views="question.views"
                        :time-stamp="question.created_at"
                        :image-urls="question.image_urls"
                        :bubble-key="index"
                        :click-card="navigateTo"
                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                        :style="{
                            marginTop: index === 0 ? '16px' : '0',
                        }"
                    />
                </div>
            </Transition>
        </div>
    </QuestionListPage>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { BubbleCard } from '@/components/bubble-card'
import QuestionListPage from '@/components/question-list-page'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { useQuestionDetailNavigation } from '@/composables/useQuestionDetailNavigation'
import { useQuestionListPageShell } from '@/composables/useQuestionListPageShell'
import { useThemeBackgroundIndex } from '@/composables/useThemeBackgroundIndex'
import { SidebarStore } from '@/store/modules/sidebar'
import { ElEmpty } from 'element-plus/es/components/empty/index.mjs'
import 'element-plus/es/components/empty/style/css'
import type { QuestionItem } from '@/model/question.model'
import {
    questionList,
    InitStatus,
    getNextQuestions,
    onSearch,
    onCancelSearch,
    currentTimeRange,
} from './HotQuestions'

const loading = ref(false)
const searchKeyword = ref('')
const listKey = ref(0)

const deviceType = DeviceTypeStore()
const sidebarStore = SidebarStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()
const { navigateTo } = useQuestionDetailNavigation(questionList)

function toggleSidebar() {
    sidebarStore.toggle()
}

const timeRange = ref<'week' | 'month' | 'all'>('all')

// Store separate lists for each time range tab to prevent double rendering and card drifting during transitions
const timeRangeLists = reactive<Record<string, QuestionItem[]>>({
    all: [],
    week: [],
    month: [],
})

watch(
    questionList,
    (newList) => {
        timeRangeLists[timeRange.value] = [...newList]
    },
    { deep: true, immediate: true }
)
const slideDirection = ref('slide-left')
const timeOptions = [
    { label: '全部', value: 'all' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
]

const timeOrder = ['all', 'week', 'month']

const handleTimeRangeChange = async (val: string | number) => {
    const oldIndex = timeOrder.indexOf(timeRange.value)
    const newIndex = timeOrder.indexOf(val as string)
    slideDirection.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'

    timeRange.value = val as 'week' | 'month' | 'all'
    currentTimeRange.value = val as 'week' | 'month' | 'all'
    listKey.value++
    loading.value = true
    InitStatus()
    await getNextQuestions(0, searchKeyword.value || undefined)
    resetScrollPosition()
    loading.value = false
}

const handleSearch = async () => {
    if (searchKeyword.value.trim() === '') {
        return
    }
    loading.value = true
    await onSearch(searchKeyword.value.trim())
    resetScrollPosition()
    loading.value = false
}

const handleCancelSearch = async () => {
    searchKeyword.value = ''
    loading.value = true
    await onCancelSearch()
    resetScrollPosition()
    loading.value = false
}

const handleReachBottom = async () => {
    if (!loading.value) {
        loading.value = true
        await getNextQuestions()
        loading.value = false
    }
}

onMounted(async () => {
    document.title = '热点问题 • SuAsk'
    if (questionList.length === 0) {
        InitStatus()
        loading.value = true
        await getNextQuestions(0)
        loading.value = false
    }
})
</script>

<style scoped lang="scss" src="./hot.scss"></style>
