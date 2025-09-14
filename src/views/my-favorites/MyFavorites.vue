<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader
                @change-sort="changeSort"
                get_keywords_url="/favorites/keywords"
                sidebar_btn
                @sidebar="sidebar"
                sort_and_search
            />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <TransitionGroup
                    name="favorite"
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
                        :click-favorite="favorite"
                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                        :style="{
                            marginTop: index === 0 ? '24px' : '0',
                            marginLeft: deviceType.isMobile ? '0' : '24px',
                        }"
                    />
                </TransitionGroup>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import QuestionHeader from '@/components/question-header'
import { ElMessage, ElScrollbar } from 'element-plus'
import { BubbleQuestion } from '@/components/bubble-card'
import BackgroundImg from '@/components/background-img'
import { Favorite, questionList, InitStatus, getNextQuestions, refresh } from './myFavorite'
import { UserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { SyncStore } from '@/store/modules/question-detail'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
const loading = ref(false)
const scrollBar = ref<InstanceType<typeof ElScrollbar>>()

const deviceType = DeviceTypeStore()
// 背景图片
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
    questionList[key].is_favorite = res.is_favorite
}

const router = useRouter()

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

onMounted(() => {
    Init()
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
.container {
    position: relative;
    width: 100%;
    height: 100%;

    .main-container {
        position: relative;
        border-top: solid 1px $su-border;
        padding: 0;

        .favorite-enter-active,
        favorite-leave-active {
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
    }
}

.background-img {
    position: absolute;
    //   top: 0;
}
</style>
