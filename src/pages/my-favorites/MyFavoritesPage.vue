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
                get_keywords_url="/favorites/keywords"
                sidebar_btn
                @sidebar="sidebar"
                sort_and_search
            />
        </template>
        <TransitionGroup name="favorite" tag="div">
            <BubbleQuestion
                v-for="(question, index) in questionList"
                :id="'question-' + question.id"
                :key="question.id"
                :title="question.title"
                :text="question.contents"
                :views="question.views"
                :time-stamp="question.created_at"
                :image-urls="question.image_urls"
                :is-favorite="question.is_favorite"
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
            />
        </TransitionGroup>
    </QuestionListPage>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'
import QuestionHeader from '@/widgets/question-header'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { BubbleQuestion } from '@/shared/ui/bubble-card'
import QuestionListPage, { useQuestionListPageShell } from '@/widgets/question-list-page'
import { useQuestionDetailNavigation } from '@/features/question-detail-navigation'
import { useThemeBackgroundIndex } from '@/shared/lib/theme'
import { Favorite, questionList, InitStatus, getNextQuestions, refresh } from './myFavorite'
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
let activatedOnce = false

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

const favorite = async (key: number) => {
    key = Number(key)
    const res = await Favorite(questionList[key].id)
    if (res == null) {
        ElMessage.error('用户未登录')
        return
    }
    questionList[key].is_favorite = res.is_favorite
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
            await getNextQuestions(sort_type ?? 0)
        } else {
            await refresh(sort_type ?? undefined)
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
.favorite-enter-active,
.favorite-leave-active {
    transition: all 0.5s ease;
}

.favorite-enter-from,
.favorite-leave-to {
    opacity: 0;
    transform: translateX(-100px);
}

.favorite-leave-active {
    position: absolute;
}
</style>
