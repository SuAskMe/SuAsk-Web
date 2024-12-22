<template>
    <el-container class="container">
        <el-header style="height: auto">
            <Header :title="'Ask All Detail'" @change-sort="changeSort" @return="navigateBack"></Header>
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar>
                <BubbleCard :title="question.title" :text="question.contents" :views="question.views"
                    :time-stamp="question.created_at" width="45vw" style="margin-top: 24px" :click-card="() => { }">
                </BubbleCard>
                <BubbleAnswer v-for="(item, index) in answerList" :key="item.id" class="answer-card"
                    :id="'answer-' + item.id" :is-mine="item.user_id == userId" :avatar="item.user_avatar"
                    :nick-name="item.nickname" :text="item.contents" :like-count="item.upvotes"
                    :is-liked="item.is_upvoted" :time-stamp="item.created_at" :image-urls="item.image_urls"
                    :is-teacher="item.teacher_name != ''" :teacher-name="item.teacher_name" :bubble-key="{
                        idx: index,
                        userId: item.user_id,
                    }" width="35vw" :click-quote="scrollToQuote"></BubbleAnswer>
            </el-scrollbar>
            <transition-group class="image-container" tag="div" name="fade-list" move-class="fade-list-move">
                <div class="picked-image" v-for="(img, index) in imageList" :key="img.id" :id="'image-' + img.id">
                    <el-image @click.stop :src="img.url" :preview-src-list="[img.url]" class="image" fit="cover"
                        preview-teleported></el-image>
                    <div class="delete-btn" @click.stop="deleteImage(index)">
                        <SvgIcon icon="delete-round" color="#FF5F96" size="16px"></SvgIcon>
                    </div>
                </div>
            </transition-group>
        </el-main>
        <el-footer v-if="canReply" style="height: auto">
            <Footer :question_id="question.id" v-model:file-list="fileList" v-model:image-list="imageList"></Footer>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { BubbleAnswer, BubbleCard } from "@/components/bubble-card";
import Header from "./Header.vue";
import BackgroundImg from "@/components/backgroud-img";
import { scrollToQuote } from "./QuestionDetail";
import { onMounted, ref } from "vue";
import Footer from "./Footer.vue";
import SvgIcon from "@/components/svg-icon";
import { useRoute } from "vue-router";
import { router } from "@/router";
import { getUserInfo } from "@/utils/userInfo";
import { getAnswer } from "@/api/answer/answer.api";
import type { Answer, Question, QuestionDetailRes } from "@/model/answer.model";

const bg_img_index = getUserInfo().themeId;

interface Img {
    id: number;
    url: string;
}
const route = useRoute();
// const answerList: AnswerItem[] = reactive([]);
const fileList = ref<File[]>([]);
const imageList = ref<Img[]>([]);

const deleteImage = (index: number) => {
    fileList.value.splice(index, 1);
    imageList.value.splice(index, 1);
};

const changeSort = (index: number) => {
    switch (index) {
        case 0:
            answerList.value.sort((a, b) => b.created_at - a.created_at);
            break;
        case 1:
            answerList.value.sort((a, b) => a.created_at - b.created_at);
            break;
        case 2:
            answerList.value.sort((a, b) => b.upvotes - a.upvotes);
            break;
        case 3:
            answerList.value.sort((a, b) => a.upvotes - b.upvotes);
            break;
        default:
            break;
    }
};

const navigateBack = () => {
    router.go(-1);
};

onMounted(() => {
    document.title = "加载中..."
    getAnswerList();
});


async function getAnswerList() {
    console.log(parseInt(route.params.id as string));

    await getAnswer(parseInt(route.params.id as string)).then((res) => {
        answerList.value = res.data.answer_list;
        question.value = res.data.question;
        canReply.value = res.data.can_reply;
    }).catch((err) => {
        console.log(err);
    });
}

const answerList = ref<Answer[]>([]);
const question = ref<Question>({
    id: 0,
    title: "",
    contents: "",
    views: 0,
    created_at: 0,
    image_urls: []
})
const canReply = ref<boolean>(false);
const userId = getUserInfo().id;
</script>

<style scoped src="./QuestionDetail.scss"></style>
