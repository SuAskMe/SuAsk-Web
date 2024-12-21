<!-- <template>
    <el-container class="container">
        <el-main class="main-container">
            <BackgroundImg img_index="1" class="background-img" />
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
                    :click-card="navigateTo"
                    width="45vw"
                    :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }"
                />
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElScrollbar } from "element-plus";
import { BubbleCard, BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { GetPageHistoryList, type HistoryQuestion } from "./AskHistory";
import { router } from "@/router";
const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const Init = async () => {
    if (questionList.length === 0) {
        loading.value = true;
        questionList.push(...(await GetPageHistoryList(0)));
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

const questionList: HistoryQuestion[] = reactive([]);

const navigateTo = (key: number) => {
    router.push({
        path: `question-detail/${questionList[key].id}/${questionList[key].title}`,
    });
};

onMounted(() => {
    Init();
});
</script>

<style scoped src="./AskAll.scss"></style> -->
