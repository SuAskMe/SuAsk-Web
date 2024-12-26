<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader
                @change-sort="changeSort"
                @search="search"
                @cancel-search="cancelSearch"
                search
                has_sort_upvote
                get_keywords_url="/questions/public/keywords"
            />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar
                v-loading="loading"
                ref="scrollBar"
                @scroll="handleScroll"
            >
                <BubbleCard
                    v-for="(question, index) in questionList"
                    :key="question.id"
                    :title="question.title"
                    :text="question.contents"
                    :views="question.views"
                    :time-stamp="question.created_at"
                    :image-urls="question.image_urls"
                    :is-pinned="true"
                    :bubble-key="index"
                    show-pin
                    :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }"
                    width="45vw"
                ></BubbleCard>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { ElMessage, ElScrollbar } from "element-plus";
import {
    BubbleAnswer,
    BubbleCard,
    BubbleQuestion,
} from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { router } from "@/router";
import { getUserInfo } from "@/utils/userInfo";
import type { QuestionItem } from "@/model/question.model";
import QuestionHeader from "@/components/question-header";
import { Favorite, getNextQuestions } from "./askMe";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const bg_img_index = 1;
// const bg_img_index = getUserInfo().themeId;
// console.log(bg_img_index);

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

const changeSort = async (sortType: number) => {
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

const questionList: QuestionItem[] = reactive([]);

const pin = async (key: number) => {
    let res = await Favorite(questionList[key].id);
    if (res == null) {
        ElMessage.error("用户未登录");
        return;
    }
    questionList[key].is_favorite = res;
};

const navigateTo = (key: number) => {
    router.push({
        path: `question-detail/${questionList[key].id}`,
    });
};

onMounted(() => {
    Init();
});
</script>

<style scoped src="./AskMe.scss"></style>
