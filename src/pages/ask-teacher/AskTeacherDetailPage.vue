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
                @return="navigateBack"
                :title="teacherName + '的提问箱'"
                search
                return_btn
                get_keywords_url="/questions/teacher/keywords"
                has_sort_upvote
                :teacher_id="teacherId"
                sort_and_search
            />
        </template>
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
                :is-pinned="question.is_pinned"
                :tag="question.is_pinned ? '置顶' : ''"
                :bubble-key="index"
                :click-card="navigateTo"
                :width="deviceType.isMobile ? '80vw' : '45vw'"
                :style="{
                    marginTop: index === 0 ? '24px' : '0',
                }"
            />
        </TransitionGroup>
        <template #floating>
            <div class="ask-btn" @click.stop="composeDialogStore.open()">
                <el-icon size="30" color="#fff">
                    <Plus />
                </el-icon>
            </div>
        </template>
    </QuestionListPage>
    <compose-dialog type="ask" @question-posted="handleQuestionPosted" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref } from 'vue'
import QuestionListPage, { useQuestionListPageShell } from '@/widgets/question-list-page'
import { BubbleCard } from '@/shared/ui/bubble-card'
// import { AskDialog } from '@/features/question-compose'
import QuestionHeader from '@/widgets/question-header'
import { useQuestionDetailNavigation } from '@/features/question-detail-navigation'
import { useThemeBackgroundIndex } from '@/shared/lib/theme'
import type { QuestionItem } from '@/entities/question'
import { useRoute, useRouter } from 'vue-router'
import { DeviceTypeStore } from '@/shared/model/device-type.store'
import { ComposeDialogStore } from '@/app/store/modules/compose-dialog'
import ComposeDialog from '@/features/question-compose'
import { Plus } from '@element-plus/icons-vue'
import {
    questionList,
    InitStatus,
    getNextQuestions,
    onSearch,
    onCancelSearch,
    refresh,
    currentTeacherId,
} from './askTeacher'

// const showDialog = ref(false);
const loading = ref(false)

const deviceType = DeviceTypeStore()
const bg_img_index = useThemeBackgroundIndex()
const { listPage, resetScrollPosition } = useQuestionListPageShell()
const { navigateTo } = useQuestionDetailNavigation(questionList)

const composeDialogStore = ComposeDialogStore()

const route = useRoute()

const teacherName = ref('')
const teacherId = ref<number>(0)

provide('teacher', {
    teacherId,
    teacherName,
})

const Init = async () => {
    if (currentTeacherId.value != teacherId.value || questionList.length === 0) {
        InitStatus()
        loading.value = true
        currentTeacherId.value = teacherId.value
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

let sort_type: number | null = null

const changeSort = async (sortType: number) => {
    if (sort_type !== null && sortType === sort_type) {
        return
    }
    sort_type = sortType
    loading.value = true
    currentTeacherId.value = teacherId.value
    await refresh(sortType)
    resetScrollPosition()
    loading.value = false
}

const search = async (keyword: string) => {
    loading.value = true
    currentTeacherId.value = teacherId.value
    await onSearch(keyword)
    resetScrollPosition()
    loading.value = false
}

const cancelSearch = async () => {
    loading.value = true
    currentTeacherId.value = teacherId.value
    await onCancelSearch()
    resetScrollPosition()
    loading.value = false
}
const router = useRouter()

const navigateBack = () => {
    router.back()
}

const observe = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.animate([{ background: '#80808050' }, { background: '#80808000' }], {
                    duration: 1500,
                    easing: 'ease-in-out',
                    iterations: 1,
                })
            }
        })
    },
    { threshold: 1.0 },
)

const handleQuestionPosted = (question: QuestionItem) => {
    questionList.unshift(question)
    nextTick(() => {
        const el = document.getElementById(`question-${question.id}`)
        if (el) {
            el.style['opacity'] = '0.8'
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            observe.observe(el)
            setTimeout(() => {
                observe.unobserve(el)
            }, 2000)
        }
    })
}
// route.path
// let nameRecord = "";

// watch(
//     () => route.path,
//     () => {
//         if (route.name !== "AskTeacherDetail") {
//             return;
//         }
//         let tid = Number(route.params.teacher_id);
//         let tname = String(route.params.teacher_name);
//         document.title = `${teacherName.value}的提问箱`;
//         if (tname === nameRecord) {
//             return;
//         }
//         nameRecord = tname;
//         teacherId.value = tid;
//         teacherName.value = tname;
//         questionList.length = 0;
//         Init();
//     }
// );

onMounted(() => {
    teacherId.value = Number(route.params.teacher_id)
    teacherName.value = String(route.params.teacher_name)
    document.title = `${teacherName.value}的提问箱`
    Init()
})
</script>

<style scoped src="./ask-teacher-detail.scss"></style>
