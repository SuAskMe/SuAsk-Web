<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader
                @change-sort="changeSort"
                @search="search"
                @cancel-search="cancelSearch"
                @return="navigateBack"
                :title="teacherName + '的提问箱'"
                search
                return_btn
                get_keywords_url="/questions/teacher/keywords"
                has_sort_upvote
                :teacher_id="teacherId"
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
                <TransitionGroup name="question">
                    <BubbleCard
                        v-for="(question, index) in questionList"
                        :id="`question-${question.id}`"
                        :key="question.id"
                        :title="question.title"
                        :text="question.contents"
                        :views="question.views"
                        :time-stamp="question.created_at"
                        :image-urls="question.image_urls"
                        :bubble-key="index"
                        :click-card="navigateTo"
                        :width="deviceType.isMobile ? '80vw' : '45vw'"
                        :style="{
                            marginTop: index === 0 ? '24px' : '0',
                        }"
                    />
                </TransitionGroup>
            </el-scrollbar>
            <AskDialog
                v-model:visible="showDialog"
                :teacher="{ teacherId: teacherId, teacherName: teacherName }"
                @question-posted="handleQuestionPosted"
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
import { ElScrollbar } from "element-plus";
import { BubbleCard, BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { AskDialog } from "@/components/ask-and-answer-dialog";
import { getNextQuestions, InitStatus } from "./AskTeacher";
import QuestionHeader from "@/components/question-header/QuestionHeader.vue";
import type { QuestionItem } from "@/model/question.model";
import { useRoute, useRouter } from "vue-router";
import { UserStore } from "@/store/modules/user";
import { SyncStore } from "@/store/modules/question-detail";
import { storeToRefs } from "pinia";
import { DeviceTypeStore } from "@/store/modules/device-type";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const deviceType = DeviceTypeStore();
// 背景图片
const userStore = UserStore();
const bg_img_index = computed(() =>
    userStore.getUser().themeId ? userStore.getUser().themeId : 1
);

const route = useRoute();

const teacherName = ref("");
const teacherId = ref(0);

const Init = async () => {
    if (questionList.length === 0) {
        InitStatus();
        loading.value = true;
        questionList.push(...(await getNextQuestions(teacherId.value, 0)));
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
            questionList.push(...(await getNextQuestions(teacherId.value)));
            loading.value = false;
        }
    }
};

let sort_type = 0;

const changeSort = async (sortType: number) => {
    if (sortType === sort_type) {
        return;
    }
    sort_type = sortType;
    loading.value = true;
    questionList.length = 0;
    questionList.push(...(await getNextQuestions(teacherId.value, sortType)));
    loading.value = false;
};

const search = async (keyword: string) => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(
        ...(await getNextQuestions(teacherId.value, undefined, keyword))
    );
    loading.value = false;
};

const cancelSearch = async () => {
    loading.value = true;
    questionList.length = 0;
    questionList.push(
        ...(await getNextQuestions(teacherId.value, undefined, undefined, true))
    );
    loading.value = false;
};

const questionList: QuestionItem[] = reactive([]);

let record = {
    index: -2,
    id: -2,
    views: -1,
};
const syncStore = SyncStore();
watch(
    () => {
        return syncStore.Views;
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

const router = useRouter();

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

const navigateBack = () => {
    router.back();
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

const handleQuestionPosted = (question: QuestionItem) => {
    questionList.unshift(question);
    nextTick(() => {
        const el = document.getElementById(`question-${question.id}`);
        if (el) {
            el.style["opacity"] = "0.8";
            // console.log(el.style);
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            observe.observe(el);
            setTimeout(() => {
                observe.unobserve(el);
            }, 2000);
        }
    });
};
// route.path
// let nameRecord = "";

// watch(
//     () => route.path,
//     () => {
//         if (route.name !== "AskTeacherDetail") {
//             return;
//         }
//         let tid = Number(route.params.teacher_id);
//         let tname = String(route.params.teacher_name);
//         document.title = `${teacherName.value}的提问箱`;
//         if (tname === nameRecord) {
//             return;
//         }
//         nameRecord = tname;
//         teacherId.value = tid;
//         teacherName.value = tname;
//         questionList.length = 0;
//         Init();
//     }
// );

onMounted(() => {
    teacherId.value = Number(route.params.teacher_id);
    teacherName.value = String(route.params.teacher_name);
    document.title = `${teacherName.value}的提问箱`;
    Init();
});
</script>

<style scoped src="./AskTeacher.scss"></style>
