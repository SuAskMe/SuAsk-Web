<template>
    <el-container class="container">
        <el-header style="height: auto">
            <Header @change-sort="changeSort" />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg img_index="1" class="background-img" />
            <el-scrollbar
                v-loading="loading"
                ref="scrollBar"
                @scroll="handleScroll"
            >
                <BubbleQuestion
                    v-for="(question, index) in questionList"
                    :key="question.id"
                    :title="question.title"
                    :text="question.text"
                    :views="question.views"
                    :time-stamp="question.created_at"
                    :image-urls="question.image_urls"
                    :is-favourite="question.is_favourite"
                    :answer-num="question.answer_num"
                    :avatars="question.answer_avatars"
                    :bubble-key="index"
                    :click-favourite="favourite"
                    width="45vw"
                    :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }"
                />
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
import AskDialog from "@/components/ask-dialog";
import { getNextQuestions, type QuestionItem } from "./AskAll";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

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
            getQuestions();
        }
    }
};

const getQuestions = async (isNew: boolean = false) => {
    loading.value = true;
    if (isNew) {
        questionList.length = 0;
    }
    questionList.push(...(await getNextQuestions()));
    loading.value = false;
};

const changeSort = async (sortType: number) => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(...(await getNextQuestions(sortType)));
    loading.value = false;
};

const questionList: QuestionItem[] = reactive([]);

const favourite = (key: number) => {
    questionList[key].is_favourite = !questionList[key].is_favourite;
};

onMounted(() => {
    getQuestions(true);
});
</script>

<style scoped src="./AskAll.scss"></style>
