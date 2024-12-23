<template>
    <el-container class="container">
        <el-header style="height: auto">
            <Header @change-sort="changeSort" @search="search" @cancel-search="cancelSearch" />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <BubbleQuestion v-for="(question, index) in questionList" :key="question.id" :title="question.title"
                    :text="question.contents" :views="question.views" :time-stamp="question.created_at"
                    :image-urls="question.image_urls" :is-favourite="question.is_favorited"
                    :answer-num="question.answer_num" :avatars="question.answer_avatars" :bubble-key="index"
                    :click-card="navigateTo" :click-favourite="favourite" width="45vw" :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }" />
            </el-scrollbar>
            <AskDialog v-model:visible="showDialog" />
            <div class="ask-btn" @click.stop="showDialog = true">+</div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Header from "./Header.vue";
import { ElScrollbar } from "element-plus";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { AskDialog } from "@/components/ask-and-answer-dialog";
import { Favorite, getNextQuestions, type QuestionItem } from "./askTeacher";
import { router } from "@/router";
import { getUserInfo } from "@/utils/userInfo";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const bg_img_index = getUserInfo().themeId


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

const favourite = async (key: number) => {
    let res = await Favorite(questionList[key].id);
    questionList[key].is_favorited = res;
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

<style scoped src="./AskAll.scss"></style>
