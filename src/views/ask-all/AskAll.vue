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
                        :is-favorite="question.is_favorite"
                        :answer-num="question.answer_num"
                        :avatars="question.answer_avatars"
                        :bubble-key="index"
                        :click-card="navigateTo"
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
            <AskDialog
                v-model:visible="showDialog"
                @question-posted="handleAnswerPosted"
                :fullscreen="deviceType.isMobile"
            />
            <div class="ask-btn" @click.stop="showDialog = true">
                <el-icon size="30" color="#fff">
                    <Plus />
                </el-icon>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { ElMessage, ElScrollbar } from "element-plus";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { AskDialog } from "@/components/ask-and-answer-dialog";
import type { QuestionItem } from "@/model/question.model";
import QuestionHeader from "@/components/question-header";
import { Favorite, getNextQuestions, InitStatus } from "./AskAll";
import { storeToRefs } from "pinia";
import { UseQDMessageStore } from "@/store/modules/question-detail";
import { UserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { SidebarStore } from "@/store/modules/sidebar";
import { DeviceTypeStore } from "@/store/modules/device-type";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

// 背景图片
const deviceType = DeviceTypeStore();

const userStore = UserStore();
const bg_img_index = computed(() => userStore.getUser().themeId);

const Init = async () => {
    if (questionList.length === 0) {
        InitStatus();
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
    console.log("sidebar");
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

let record = 0;
const ErrorMsg = UseQDMessageStore();
const { HasError } = storeToRefs(ErrorMsg);

watch(HasError, (newVal) => {
    if (newVal) {
        questionList[record].views -= 1;
        ErrorMsg.clearErr();
    }
});

const router = useRouter();

const navigateTo = (key: number) => {
    key = Number(key);
    record = key;
    questionList[key].views += 1;
    router.push({
        path: `/question-detail/${questionList[key].id}`,
    });
};

const observe = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.animate(
                    [{ background: "#80808050" }, { background: "#80808000" }],
                    { duration: 1500, easing: "ease-in-out", iterations: 1 }
                );
            }
        });
    },
    { threshold: 1.0 }
);

async function handleAnswerPosted(question: QuestionItem) {
    questionList.unshift(question);
    nextTick(() => {
        const el = document.getElementById(`question-${question.id}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            observe.observe(el);
            setTimeout(() => {
                observe.unobserve(el);
            }, 2000);
        }
    });
}

onMounted(() => {
    Init();
});
</script>

<style scoped src="./AskAll.scss"></style>
