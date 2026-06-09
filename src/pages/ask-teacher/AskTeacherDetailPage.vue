<template>
    <QuestionListPage
        ref="listPage"
        :img-index="bg_img_index"
        :loading="loading"
        scroll-mask
        @reach-bottom="handleReachBottom"
    >
        <template #header>
            <QuestionHeader @return="navigateBack" :title="teacherName + '的提问箱'" return_btn />
        </template>
        <template #toolbar>
            <div class="teacher-question-filter">
                <div class="search-bar">
                    <div class="search-wrapper">
                        <svg-icon icon="search" color="#999" size="18px" class="search-icon" />
                        <input
                            v-model="searchKeyword"
                            type="text"
                            placeholder="搜索问题标题..."
                            class="search-native-input"
                            @keyup.enter="handleSearch"
                        />
                        <span v-if="searchKeyword" class="search-clear" @click="handleCancelSearch">
                            &times;
                        </span>
                    </div>
                </div>
                <div class="sort-filter">
                    <div class="sort-tabs">
                        <button
                            v-for="option in sortOptions"
                            :key="option.value"
                            type="button"
                            :class="['sort-tab', { active: activeSort === option.value }]"
                            @click="handleSortChange(option.value)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>
            </div>
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
import { useThemeBackgroundIndex } from '@/entities/user'
import type { QuestionItem } from '@/entities/question'
import { useRoute, useRouter } from 'vue-router'
import { DeviceTypeStore } from '@/shared/model/device-type.store'
import { ComposeDialogStore } from '@/features/question-compose/model'
import ComposeDialog from '@/features/question-compose'
import { getUserByIdApi } from '@/entities/user/api/user.api'
import { Plus } from '@element-plus/icons-vue'
import {
    questionList,
    InitStatus,
    getNextQuestions,
    refresh,
    currentTeacherId,
} from './askTeacher'

// const showDialog = ref(false);
const loading = ref(false)
const searchKeyword = ref('')
const activeSort = ref(0)
const sortOptions = [
    { label: '时间', value: 0 },
    { label: '热度', value: 2 },
]

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

const handleSortChange = async (sortType: number) => {
    if (sortType === activeSort.value) {
        return
    }
    activeSort.value = sortType
    loading.value = true
    currentTeacherId.value = teacherId.value
    await refresh(sortType, searchKeyword.value.trim() || undefined)
    resetScrollPosition()
    loading.value = false
}

const handleSearch = async () => {
    const keyword = searchKeyword.value.trim()
    if (!keyword) {
        await handleCancelSearch()
        return
    }
    searchKeyword.value = keyword
    loading.value = true
    currentTeacherId.value = teacherId.value
    await refresh(activeSort.value, keyword)
    resetScrollPosition()
    loading.value = false
}

const handleCancelSearch = async () => {
    searchKeyword.value = ''
    loading.value = true
    currentTeacherId.value = teacherId.value
    await refresh(activeSort.value, '')
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

const getRouteParam = (param: unknown) => {
    if (Array.isArray(param)) {
        return param[0]
    }
    return typeof param === 'string' ? param : ''
}

const resolveTeacherName = async () => {
    const routeTeacherName = getRouteParam(route.params.teacher_name)
    if (routeTeacherName) {
        teacherName.value = routeTeacherName
        return
    }

    teacherName.value = '老师'
    try {
        const teacher = await getUserByIdApi(String(teacherId.value))
        teacherName.value = teacher?.name || teacher?.nickname || '老师'
    } catch {
        teacherName.value = '老师'
    }
}

onMounted(async () => {
    teacherId.value = Number(route.params.teacher_id)
    await resolveTeacherName()
    document.title = `${teacherName.value}的提问箱`
    Init()
})
</script>

<style scoped src="./ask-teacher-detail.scss"></style>
