<template>
    <el-container class="container">
        <el-header style="height: auto">
            <Header
                :title="'Ask All Detail'"
                @change-sort="changeSort"
                @return="navigateBack"
            ></Header>
        </el-header>
        <el-main class="main-container">
            <BackgroundImg img_index="1" class="background-img" />
            <el-scrollbar>
                <BubbleCard
                    :title="'Ask All Detail'"
                    :text="'This is the content of Ask All Detail page.'"
                    :views="123"
                    :time-stamp="new Date().getTime()"
                    width="45vw"
                    style="margin-top: 24px"
                ></BubbleCard>
                <BubbleAnswer
                    v-for="(item, index) in answerList"
                    :key="item.id"
                    class="answer-card"
                    :id="'answer-' + item.id"
                    :is-mine="item.isMine"
                    :avatar="item.avatar"
                    :nick-name="item.nickName"
                    :text="item.content"
                    :like-count="item.upvotesCount"
                    :is-liked="item.isLiked"
                    :time-stamp="item.createdAt"
                    :quote="item.quote"
                    :image-urls="item.imageUrls"
                    :is-teacher="item.isTeacher"
                    :teacher-name="item.teacherName"
                    :bubble-key="{
                        idx: index,
                        quoteId: item.quote.id,
                        userId: item.userId,
                    }"
                    width="35vw"
                    :click-quote="scrollToQuoute"
                ></BubbleAnswer>
            </el-scrollbar>
            <transition-group
                class="image-container"
                tag="div"
                name="fade-list"
                move-class="fade-list-move"
            >
                <div
                    class="picked-image"
                    v-for="(img, index) in imageList"
                    :key="img.id"
                    :id="'image-' + img.id"
                >
                    <el-image
                        @click.stop
                        :src="img.url"
                        :preview-src-list="[img.url]"
                        class="image"
                        fit="cover"
                        preview-teleported
                    ></el-image>
                    <div class="delete-btn" @click.stop="deleteImage(index)">
                        <SvgIcon
                            icon="delete-round"
                            color="#FF5F96"
                            size="16px"
                        ></SvgIcon>
                    </div>
                </div>
            </transition-group>
        </el-main>
        <el-footer style="height: auto">
            <Footer
                v-model:file-list="fileList"
                v-model:image-list="imageList"
            ></Footer>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { BubbleAnswer, BubbleCard } from "@/components/bubble-card";
import Header from "./Header.vue";
import BackgroundImg from "@/components/backgroud-img";
import { scrollToQuoute, answerList_, type AnswerItem } from "./QuestionDetail";
import { onMounted, reactive, ref } from "vue";
import Footer from "./Footer.vue";
import SvgIcon from "@/components/svg-icon";
import { pullInfo } from "./request";
import { useRoute } from "vue-router";
import { router } from "@/router";
interface Img {
    id: number;
    url: string;
}
const route = useRoute();
const question = ref();
const answerList: AnswerItem[] = reactive(answerList_);
const fileList = ref<File[]>([]);
const imageList = ref<Img[]>([]);

const deleteImage = (index: number) => {
    fileList.value.splice(index, 1);
    imageList.value.splice(index, 1);
};

const changeSort = (index: number) => {
    switch (index) {
        case 0:
            answerList.sort((a, b) => b.createdAt - a.createdAt);
            break;
        case 1:
            answerList.sort((a, b) => a.createdAt - b.createdAt);
            break;
        case 2:
            answerList.sort((a, b) => b.upvotesCount - a.upvotesCount);
            break;
        case 3:
            answerList.sort((a, b) => a.upvotesCount - b.upvotesCount);
            break;
        default:
            break;
    }
};

const navigateBack = () => {
    router.go(-1);
};

onMounted(() => {
    document.title = route.params.title as string;
    question.value = pullInfo(parseInt(route.params.id as string));
});
</script>

<style scoped src="./QuestionDetail.scss"></style>
