<template>
    <el-container class="container">
        <el-header style="height: auto">
            <Header />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg img_index="1" class="background-img" />
            <el-scrollbar>
                <BubbleQuestion
                    v-for="(question, index) in questionList"
                    :key="question.title"
                    :title="question.title"
                    :text="question.text"
                    :views="question.views"
                    :time-stamp="question.timeStamp"
                    :image-urls="question.imageUrls"
                    :is-favourite="question.isFavourite"
                    :bubble-key="index"
                    :click-favourite="
                        (key) => {
                            questionList[key].isFavourite =
                                !questionList[key].isFavourite;
                        }
                    "
                    width="45vw"
                    :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }"
                />
            </el-scrollbar>
            <!-- <AskDialog /> -->
            <div class="ask-btn">+</div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Header from "../../header/Header.vue";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";

const imagesUrls: string[] = [
    "/src/assets/default-avatar.png",
    "/src/assets/default-avatar.png",
    "/src/assets/default-avatar.png",
    "/src/assets/default-avatar.png",
    "/src/assets/default-avatar.png",
    // "/src/assets/default-avatar.png",
    // "/src/assets/default-avatar.png",
    // "/src/assets/default-avatar.png",
];

const questionList = reactive([
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
    {
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        timeStamp: new Date().getTime(),
        imageUrls: imagesUrls,
        isFavourite: false,
    },
]);
</script>

<style scoped src="./AskAll.scss"></style>
