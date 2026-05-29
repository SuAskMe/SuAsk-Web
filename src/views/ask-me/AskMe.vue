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
                has_sort_upvote
                sidebar_btn
                get_keywords_url="/questions/inbox/keywords"
                sort_and_search
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
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { BubbleCard } from '@/components/bubble-card'
import QuestionListPage from '@/components/question-list-page'
import QuestionHeader from '@/components/question-header'
import { useQuestionDetailNavigation } from '@/composables/useQuestionDetailNavigation'
import { useQuestionListPageShell } from '@/composables/useQuestionListPageShell'
import { useThemeBackgroundIndex } from '@/composables/useThemeBackgroundIndex'
import {
    Pin,
    questionList,
    InitStatus,
    getNextQuestions,
    onSearch,
    onCancelSearch,
    refresh,
} from './AskMe'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
const loading = ref(false)

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()
const { navigateTo } = useQuestionDetailNavigation(questionList)

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

let sort_type: number | null = null

const changeSort = async (sortType: number) => {
    if (sort_type !== null && sortType === sort_type) {
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
    const res = await Pin(questionList[key].id)
    if (res == null) {
        ElMessage.error('用户未登录')
        return
    }
    questionList[key].is_pinned = res
}
onMounted(() => {
    Init()
})
</script>

<style scoped src="./AskMe.scss"></style>
