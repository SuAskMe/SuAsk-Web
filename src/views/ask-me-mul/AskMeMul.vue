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
                :title="title"
                :has_sort_upvote="title !== '置顶提问'"
                :sort_and_search="title !== '置顶提问'"
                @sidebar="sidebar"
                sidebar_btn
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
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
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
    refresh,
    setAnsweredOrNot,
} from './AskMeMul'
import { DeviceTypeStore } from '@/store/modules/device-type'
import { SidebarStore } from '@/store/modules/sidebar'
const loading = ref(false)

const sidebarStore = SidebarStore()
const sidebar = () => {
    sidebarStore.toggle()
}

interface AskMeAnsProps {
    type: string
}

const props = defineProps<AskMeAnsProps>()
setAnsweredOrNot(props.type)
const title = computed(() => {
    switch (props.type) {
        case 'unanswered':
            return '新的提问'
        case 'answered':
            return '已回答提问'
        case 'top':
            return '置顶提问'
        default:
            return ''
    }
})

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()
const { navigateTo } = useQuestionDetailNavigation(questionList)

const Init = async () => {
    if (questionList.length === 0) {
        InitStatus(props.type)
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

let sort_type = 0

const changeSort = async (sortType: number) => {
    if (sortType === sort_type) {
        return
    }
    sort_type = sortType
    loading.value = true
    await refresh(sortType)
    loading.value = false
    resetScrollPosition()
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

watch(
    () => props.type,
    () => {
        questionList.length = 0
        Init()
    },
)
onMounted(() => {
    Init()
})

// function navigateBack() {
//     router.push('/ask-me')
// }
</script>

<style scoped src="./AskMeMul.scss"></style>
