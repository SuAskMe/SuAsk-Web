<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader @change-sort="changeSort" @search="search" @cancel-search="cancelSearch" search
                has_sort_upvote sort_and_search get_keywords_url="/questions/public/keywords" />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <TransitionGroup name="question">
                    <BubbleQuestion v-for="(question, index) in questionList" :key="question.id" :title="question.title"
                        :id="'question-' + question.id" :text="question.contents" :views="question.views"
                        :time-stamp="question.created_at" :image-urls="question.image_urls"
                        :is-favorite="question.is_favorite" :answer-num="question.answer_num"
                        :avatars="question.answer_avatars" :bubble-key="index" :click-card="navigateTo"
                        :show-favorite="false" :click-favorite="favorite" width="45vw" :style="{
                            marginTop: index === 0 ? '24px' : '0',
                        }" />
                </TransitionGroup>
            </el-scrollbar>
            <AskDialog v-model:visible="showDialog" @question-posted="handleAnswerPosted" />
            <div class="ask-btn" @click.stop="showDialog = true">
                <el-icon size="30" color="#fff">
                    <Plus />
                </el-icon>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { ElMessage, ElScrollbar } from "element-plus";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { AskDialog } from "@/components/ask-and-answer-dialog";
import { router } from "@/router";
import type { QuestionItem } from "@/model/question.model";
import QuestionHeader from "@/components/question-header";
import { Favorite, getNextQuestions } from "./askAll";
import { UserInfoStore } from "@/store/modules/sidebar";
import { storeToRefs } from "pinia";
import { getUserInfo } from "@/utils/userInfo";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

// 背景图片
let bg_img_index = ref(getUserInfo().themeId);
const userStore = UserInfoStore();
const { userInfo } = storeToRefs(userStore);

watch(userInfo, () => {
    bg_img_index.value = userInfo.value.themeId;
});


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

const favorite = async (key: number) => {
    key = Number(key);
    let res = await Favorite(questionList[key].id);
    if (res == null) {
        ElMessage.error("用户未登录");
        return;
    }
    questionList[key].is_favorite = res;
};

const navigateTo = (key: number) => {
    router.push({
        path: `/question-detail/${questionList[key].id}`,
    });
};

async function handleAnswerPosted(question_id: number) {
    console.log(question_id);
}

onMounted(() => {
    Init();
});
</script>

<style scoped src="./AskAll.scss"></style>
