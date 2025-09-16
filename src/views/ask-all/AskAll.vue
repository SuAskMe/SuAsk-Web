<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader
                @change-sort="changeSort"
                @search="search"
                @cancel-search="cancelSearch"
                @sidebar="sidebar"
                search
                has_sort_upvote
                sidebar_btn
                sort_and_search
                get_keywords_url="/questions/public/keywords"
            />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <TransitionGroup
                    name="question"
                    tag="div"
                    :style="
                        deviceType.isMobile
                            ? {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                              }
                            : {}
                    "
                >
                    <BubbleQuestion
                        v-for="(question, index) in questionList"
                        :key="question.id"
                        :title="question.title"
                        :id="'question-' + question.id"
                        :text="question.contents"
                        :views="question.views"
                        :time-stamp="question.created_at"
                        :image-urls="question.image_urls"
                        :is-favorite="question.is_favorite"
                        :answer-num="question.answer_num"
                        :avatars="question.answer_avatars"
                        :bubble-key="index"
                        :click-card="navigateTo"
                        :click-footer="navigateToAnswer"
                        :show-favorite="false"
                        :click-favorite="favorite"
                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                        :style="{
                            marginTop: index === 0 ? '24px' : '0',
                            marginLeft: deviceType.isMobile ? '0' : '24px',
                        }"
                    />
                </TransitionGroup>
            </el-scrollbar>
            <!-- <AskDialog v-model:visible="showDialog" @question-posted="handleAnswerPosted"
                :fullscreen="deviceType.isMobile" /> -->
            <div class="ask-btn" @click.stop="composeDialogStore.open()">
                <el-icon size="30" color="#fff">
                    <Plus />
                </el-icon>
            </div>
        </el-main>
    </el-container>
    <compose-dialog type="ask" @question-posted="handleAnswerPosted" />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ElMessage, ElScrollbar } from 'element-plus'
import { BubbleQuestion } from '@/components/bubble-card'
import BackgroundImg from '@/components/background-img'
import type { QuestionItem } from '@/model/question.model'
import QuestionHeader from '@/components/question-header'
import {
    Favorite,
    questionList,
    InitStatus,
    getNextQuestions,
    onSearch,
    onCancelSearch,
    refresh,
} from './AskAll'
import { SyncStore } from '@/store/modules/question-detail'
import { UserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
import ComposeDialog from '@/components/compose/ComposeDialog.vue'
import { ComposeDialogStore } from '@/store/modules/compose-dialog'

// const showDialog = ref(false);
const loading = ref(false)
const scrollBar = ref<InstanceType<typeof ElScrollbar>>()
const router = useRouter()

// 背景图片
const deviceType = DeviceTypeStore()

const composeDialogStore = ComposeDialogStore()

const userStore = UserStore()
const bg_img_index = computed(() => (userStore.getUser().themeId ? userStore.getUser().themeId : 1))

const Init = async () => {
    if (questionList.length === 0) {
        InitStatus()
        loading.value = true
        await getNextQuestions(0)
        loading.value = false
    }
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
            loading.value === false
        ) {
            loading.value = true
            await getNextQuestions()
            loading.value = false
        }
    }
}

const sidebarStore = SidebarStore()

const sidebar = () => {
    // console.log("sidebar");
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

// 重置滚动位置到顶部
const resetScrollPosition = () => {
    nextTick(() => {
        if (scrollBar.value && scrollBar.value.wrapRef) {
            scrollBar.value.wrapRef.scrollTop = 0
        }
    })
}

const favorite = async (key: number) => {
    key = Number(key)
    const res = await Favorite(questionList[key].id)
    if (res == null) {
        ElMessage.error('用户未登录')
        return
    }
    questionList[key].is_favorite = res
}

let record = {
    index: -2,
    id: -2,
    views: -1,
}
const syncStore = SyncStore()
watch(
    () => {
        return syncStore.Views
    },
    () => {
        if (
            record.index === syncStore.IndexOf &&
            record.id === syncStore.QuestionID &&
            record.views !== syncStore.Views
        ) {
            questionList[record.index].views = syncStore.Views
            record.views = syncStore.Views
        }
    },
)

const navigateTo = (key: number) => {
    key = Number(key)
    record = {
        index: key,
        id: questionList[key].id,
        views: questionList[key].views,
    }
    syncStore.SetSync(key, questionList[key].id, questionList[key].views)

    router.push({
        path: `/question-detail/${questionList[key].id}`,
    })
}

const navigateToAnswer = (key: number) => {
    key = Number(key)
    record = {
        index: key,
        id: questionList[key].id,
        views: questionList[key].views,
    }
    syncStore.SetSync(key, questionList[key].id, questionList[key].views)

    router.push({
        path: `/question-detail/${questionList[key].id}`,
    })
    nextTick(() => {
        if (questionList[key].answer_num === 0) {
            composeDialogStore.open()
        }
    })
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

async function handleAnswerPosted(question: QuestionItem) {
    console.log('handleAnswerPosted', question)
    questionList.unshift(question)
    nextTick(() => {
        const el = document.getElementById(`question-${question.id}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            observe.observe(el)
            setTimeout(() => {
                observe.unobserve(el)
            }, 2000)
        }
    })
}

onMounted(() => {
    Init()
})
</script>

<style scoped src="./AskAll.scss"></style>
