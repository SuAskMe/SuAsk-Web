<template>
    <el-container class="container">
        <el-header class="hot-header-bar">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <div class="hot-title">
                <p>热点问题</p>
            </div>
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
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
                        <span
                            v-if="searchKeyword"
                            class="search-clear"
                            @click="handleCancelSearch"
                        >&times;</span>
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
            <el-scrollbar ref="scrollBar" @scroll="handleScroll">
                <Transition name="fade">
                    <div v-if="questionList.length === 0 && !loading" class="empty-state">
                        <el-empty description="暂无热点问题" />
                    </div>
                </Transition>
                <Transition :name="slideDirection" mode="out-in">
                    <div :key="listKey" v-loading="loading" class="question-list">
                        <BubbleCard
                            v-for="(question, index) in questionList"
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
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import { ElScrollbar } from 'element-plus'
import { BubbleCard } from '@/components/bubble-card'
import BackgroundImg from '@/components/background-img'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { UserStore } from '@/store/modules/user'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { SyncStore } from '@/store/modules/question-detail'
import { SidebarStore } from '@/store/modules/sidebar'
import { useRouter } from 'vue-router'
import {
    questionList,
    InitStatus,
    getNextQuestions,
    onSearch,
    onCancelSearch,
    refresh,
    currentTimeRange,
} from './HotQuestions'

const loading = ref(false)
const scrollBar = ref<InstanceType<typeof ElScrollbar>>()
const searchKeyword = ref('')
const listKey = ref(0)

const deviceType = DeviceTypeStore()
const userStore = UserStore()
const sidebarStore = SidebarStore()
const bg_img_index = computed(() => (userStore.getUser().themeId ? userStore.getUser().themeId : 1))

function toggleSidebar() {
    sidebarStore.toggle()
}

const timeRange = ref<'week' | 'month' | 'all'>('all')
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

const handleScroll = async () => {
    if (scrollBar.value) {
        const scrollTop = scrollBar.value.wrapRef?.scrollTop
        const clientHeight = scrollBar.value.wrapRef?.clientHeight
        const scrollHeight = scrollBar.value.wrapRef?.scrollHeight
        if (
            scrollTop &&
            clientHeight &&
            scrollHeight &&
            Math.ceil(scrollTop + clientHeight) >= scrollHeight &&
            !loading.value
        ) {
            loading.value = true
            await getNextQuestions()
            loading.value = false
        }
    }
}

const resetScrollPosition = () => {
    nextTick(() => {
        if (scrollBar.value && scrollBar.value.wrapRef) {
            scrollBar.value.wrapRef.scrollTop = 0
        }
    })
}

const router = useRouter()
const syncStore = SyncStore()

const navigateTo = (key: number) => {
    key = Number(key)
    syncStore.SetSync(key, questionList[key].id, questionList[key].views)
    router.push({
        path: `/question-detail/${questionList[key].id}`,
    })
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
