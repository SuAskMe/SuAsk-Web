<template>
    <el-container class="container">
        <el-header style="height: auto">
            <div class="hot-header">
                <div class="search-bar">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索问题标题..."
                        clearable
                        @keyup.enter="handleSearch"
                        @clear="handleCancelSearch"
                        class="search-input"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                        <template #append>
                            <el-button @click="handleSearch" :icon="Search" />
                        </template>
                    </el-input>
                </div>
                <div class="time-filter">
                    <el-segmented
                        v-model="timeRange"
                        :options="timeOptions"
                        @change="handleTimeRangeChange"
                    />
                </div>
            </div>
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <div v-if="questionList.length === 0 && !loading" class="empty-state">
                    <el-empty description="暂无热点问题" />
                </div>
                <TransitionGroup name="question">
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
                </TransitionGroup>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElScrollbar } from 'element-plus'
import { BubbleCard } from '@/components/bubble-card'
import BackgroundImg from '@/components/background-img'
import { UserStore } from '@/store/modules/user'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { SyncStore } from '@/store/modules/question-detail'
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

const deviceType = DeviceTypeStore()
const userStore = UserStore()
const bg_img_index = computed(() => (userStore.getUser().themeId ? userStore.getUser().themeId : 1))

const timeRange = ref<'week' | 'month' | 'all'>('week')
const timeOptions = [
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '全部', value: 'all' },
]

const handleTimeRangeChange = async (val: string | number) => {
    currentTimeRange.value = val as 'week' | 'month' | 'all'
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

<style scoped lang="scss">
.container {
    height: 100%;
}

.hot-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0 8px;

    .search-bar {
        .search-input {
            :deep(.el-input__wrapper) {
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            }
            :deep(.el-input-group__append) {
                border-radius: 0 20px 20px 0;
            }
        }
    }

    .time-filter {
        display: flex;
        justify-content: center;
    }
}

.main-container {
    position: relative;
    padding: 0;

    .background-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
    }
}

.question-enter-active,
.question-leave-active {
    transition: all 0.3s ease;
}

.question-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.question-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
