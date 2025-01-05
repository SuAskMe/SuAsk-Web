<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader @change-sort="changeSort" :title="title" return_btn has_sort_upvote sort_and_search />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
                <BubbleCard v-for="(question, index) in questionList" :key="question.id" :title="question.title"
                    :text="question.contents" :views="question.views" :time-stamp="question.created_at"
                    :image-urls="question.image_urls" :is-pinned="question.is_pinned" :bubble-key="index"
                    :tag="question.tag" show-pin :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }" width="45vw" :click-card="navigateTo" :click-pin="pin"></BubbleCard>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { ElMessage, ElScrollbar } from "element-plus";
import { BubbleCard } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { getUserInfo } from "@/utils/userInfo";
import QuestionHeader from "@/components/question-header";
import { getNextQuestions, Pin, setAnsweredOrNot } from "./askMeMul";
import type { QFMItem } from "@/model/teacher-self.model";
import { UserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

interface AskMeAnsProps {
    type: string;
}

const props = defineProps<AskMeAnsProps>();
setAnsweredOrNot(props.type);
const title = computed(() => {
    switch (props.type) {
        case "unanswered":
            return "未回答";
        case "answered":
            return "已回答";
        case "top":
            return "置顶";
    }
});

// 背景图片
const userStore = UserStore();
const bg_img_index = computed(() => userStore.getUser().themeId)

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

const questionList: QFMItem[] = reactive([]);

const pin = async (key: number) => {
    key = Number(key);
    let res = await Pin(questionList[key].id);
    if (res == null) {
        ElMessage.error("用户未登录");
        return;
    }
    questionList[key].is_pinned = res;
};

const router = useRouter();

const navigateTo = (key: number) => {
    key = Number(key);
    router.push({
        path: `/question-detail/${questionList[key].id}`,
    });
};

onMounted(() => {
    Init();
});
</script>

<style scoped src="./AskMeMul.scss"></style>
