<template>
    <el-container class="container">
        <el-header style="height: auto">
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
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar
                v-loading="loading"
                ref="scrollBar"
                @scroll="handleScroll"
            >
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
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import QuestionHeader from "@/components/question-header";
import { ElMessage, ElScrollbar } from "element-plus";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { Favorite, getNextQuestions } from "./AskHistory";
import type { FavoriteItem } from "@/model/favorite.model";
import { storeToRefs } from "pinia";
import { UserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { SyncStore } from "@/store/modules/question-detail";
import { SidebarStore } from "@/store/modules/sidebar";
import { DeviceTypeStore } from "@/store/modules/device-type";
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const deviceType = DeviceTypeStore();

// 背景图片
const userStore = UserStore();
const bg_img_index = computed(() => userStore.getUser().themeId);

const Init = async () => {
    if (questionList.length === 0) {
        loading.value = true;
        questionList.push(...(await getNextQuestions(0)));
        loading.value = false;
    }
};

const handleScroll = async () => {
    if (scrollBar.value) {
        const scrollTop = scrollBar.value.wrapRef?.scrollTop;
        const clientHeight = scrollBar.value.wrapRef?.clientHeight;
        const scrollHeight = scrollBar.value.wrapRef?.scrollHeight;
        if (
            scrollTop &&
            clientHeight &&
            scrollHeight &&
            Math.ceil(scrollTop + clientHeight) >= scrollHeight &&
            loading.value === false
        ) {
            loading.value = true;
            questionList.push(...(await getNextQuestions()));
            loading.value = false;
        }
    }
};

const sidebarStore = SidebarStore();

const sidebar = () => {
    // console.log("sidebar");
    sidebarStore.toggle();
};

let sort_type = 0;

const changeSort = async (sortType: number) => {
    if (sortType === sort_type) {
        return;
    }
    sort_type = sortType;
    loading.value = true;
    questionList.length = 0;
    questionList.push(...(await getNextQuestions(sortType)));
    loading.value = false;
};

const search = async (keyword: string) => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(...(await getNextQuestions(undefined, keyword)));
    loading.value = false;
};

const cancelSearch = async () => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(...(await getNextQuestions(undefined, undefined, true)));
    loading.value = false;
};

const questionList: FavoriteItem[] = reactive([]);

const favorite = async (key: number) => {
    key = Number(key);
    let res = await Favorite(questionList[key].id);
    if (res == null) {
        ElMessage.error("用户未登录");
        return;
    }
    questionList[key].is_favorite = res;
};

const router = useRouter();

let record = {
    index: -2,
    id: -2,
    views: -1,
};
const syncStore = SyncStore();
watch(
    () => {
        syncStore.Views;
    },
    () => {
        if (
            record.index === syncStore.IndexOf &&
            record.id === syncStore.QuestionID &&
            record.views !== syncStore.Views
        ) {
            questionList[record.index].views = syncStore.Views;
            record.views = syncStore.Views;
        }
    }
);

const navigateTo = (key: number) => {
    key = Number(key);
    record = {
        index: key,
        id: questionList[key].id,
        views: questionList[key].views,
    };
    syncStore.SetSync(key, questionList[key].id, questionList[key].views);
    router.push({
        path: `/question-detail/${questionList[key].id}`,
    });
};

onMounted(() => {
    Init();
});
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
    }
}

.background-img {
    position: absolute;
    //   top: 0;
}
</style>
