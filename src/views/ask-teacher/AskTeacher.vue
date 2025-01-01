<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader @change-sort="changeSort" @search="search" @cancel-search="cancelSearch"
                @return="navigateBack" search return_btn get_keywords_url="/questions/teacher/keywords" has_sort_upvote
                :teacher_id="teacher_id" />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <TransitionGroup name="question">
                    <BubbleQuestion v-for="(question, index) in questionList" :key="question.id" :title="question.title"
                        :text="question.contents" :views="question.views" :time-stamp="question.created_at"
                        :image-urls="question.image_urls" :show-favorite="false" :answer-num="question.answer_num"
                        :avatars="question.answer_avatars" :bubble-key="index" :click-card="navigateTo" width="45vw"
                        :style="{
                            marginTop: index === 0 ? '24px' : '0',
                        }" />
                </TransitionGroup>
            </el-scrollbar>
            <AskDialog v-model:visible="showDialog" />
            <div class="ask-btn" @click.stop="showDialog = true">
                <el-icon size="30" color="#fff">
                    <Plus />
                </el-icon>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElScrollbar } from "element-plus";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { AskDialog } from "@/components/ask-and-answer-dialog";
import { Favorite, getNextQuestions } from "./askTeacher";
import { router } from "@/router";
import { getUserInfo } from "@/utils/userInfo";
import QuestionHeader from "@/components/question-header/QuestionHeader.vue";
import type { QuestionItem } from "@/model/question.model";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const userInfo = getUserInfo();
const bg_img_index = userInfo ? userInfo.themeId : 1;

const teacher_id = router.currentRoute.value.params.id as unknown as number;

const Init = async () => {
    if (questionList.length === 0) {
        loading.value = true;
        questionList.push(...(await getNextQuestions(teacher_id, 0)));
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
            questionList.push(...(await getNextQuestions(teacher_id)));
            loading.value = false;
        }
    }
};

const changeSort = async (sortType: number) => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(...(await getNextQuestions(teacher_id, sortType)));
    loading.value = false;
};

const search = async (keyword: string) => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(
        ...(await getNextQuestions(teacher_id, undefined, keyword))
    );
    loading.value = false;
};

const cancelSearch = async () => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(
        ...(await getNextQuestions(teacher_id, undefined, undefined, true))
    );
    loading.value = false;
};

const questionList: QuestionItem[] = reactive([]);

const navigateTo = (key: number) => {
    key = Number(key);
    router.push({
        path: `/question-detail/${questionList[key].id}`,
    });
};

const navigateBack = () => {
    router.back();
};

onMounted(() => {
    Init();
});
</script>

<style scoped src="./AskTeacher.scss"></style>
