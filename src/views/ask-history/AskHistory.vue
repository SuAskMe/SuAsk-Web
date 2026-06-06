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
                search
                sidebar_btn
                get_keywords_url="/history/keywords"
                :return_btn="false"
                sort_and_search
            />
        </template>
        <TransitionGroup name="question" tag="div">
            <BubbleQuestion
                v-for="(question, index) in questionList"
                :id="'question-' + question.id"
                :key="question.id"
                :title="question.title"
                :text="question.contents"
                :views="question.views"
                :time-stamp="question.created_at"
                :image-urls="question.image_urls"
                :answer-num="question.answer_num"
                :avatars="question.answer_avatars"
                :bubble-key="index"
                :click-card="navigateTo"
                :click-favorite="favorite"
                :width="deviceType.isMobile ? '80vw' : '45vw'"
                :style="{
                    marginTop: index === 0 ? '24px' : '0',
                    marginLeft: deviceType.isMobile ? '0' : '24px',
                }"
                :show-favorite="false"
            />
        </TransitionGroup>
    </QuestionListPage>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'
import QuestionHeader from '@/widgets/question-header'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { BubbleQuestion } from '@/components/bubble-card'
import QuestionListPage, { useQuestionListPageShell } from '@/widgets/question-list-page'
import { useQuestionDetailNavigation } from '@/composables/useQuestionDetailNavigation'
import { useThemeBackgroundIndex } from '@/composables/useThemeBackgroundIndex'
import {
    Favorite,
    questionList,
    InitStatus,
    getNextQuestions,
    onSearch,
    onCancelSearch,
    refresh,
} from './AskHistory'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
const loading = ref(false)

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()

const Init = async () => {
    if (questionList.length === 0) {
        InitStatus()
        loading.value = true
        await getNextQuestions(0)
        loading.value = false
    }
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
let activatedOnce = false

const changeSort = async (sortType: number) => {
    if (sortType === sort_type) {
        return
    }
    sort_type = sortType
    loading.value = true
    await getNextQuestions(sortType)
    loading.value = false
    resetScrollPosition()
}

const search = async (keyword: string) => {
    loading.value = true
    await onSearch(keyword)
    loading.value = false
    resetScrollPosition()
}

const cancelSearch = async () => {
    loading.value = true
    await onCancelSearch()
    loading.value = false
    resetScrollPosition()
}

const { navigateTo } = useQuestionDetailNavigation(questionList)

const favorite = async (key: number) => {
    key = Number(key)
    const res = await Favorite(questionList[key].id)
    if (res == null) {
        ElMessage.error('用户未登录')
        return
    }
    questionList[key].is_favorite = res
}

const refreshOnActivated = async () => {
    if (!activatedOnce) {
        activatedOnce = true
        return
    }

    loading.value = true
    try {
        if (questionList.length === 0) {
            InitStatus()
            await getNextQuestions(sort_type)
        } else {
            await refresh(sort_type)
        }
        resetScrollPosition()
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    Init()
})

onActivated(() => {
    refreshOnActivated()
})
</script>

<style scoped lang="scss">
.question-enter-active,
.question-leave-active {
    transition: all 0.5s ease;
}

.question-enter-from,
.question-leave-to {
    opacity: 0;
    transform: translateX(-100px);
}
</style>
