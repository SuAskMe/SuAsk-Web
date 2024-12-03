<template>
    <BubbleQuestion
        :title="title"
        :text="text"
        :views="1000"
        :time-stamp="new Date().getTime()"
        :image-urls="imagesUrls"
        :is-favourite="isFavourite"
        :click-favourite="
            () => {
                isFavourite = !isFavourite;
            }
        "
        style="margin-top: 100px"
    ></BubbleQuestion>

    <BubbleCard
        :title="title"
        :text="markdowntext"
        :views="1000"
        :time-stamp="new Date().getTime()"
        show-pin
        :image-urls="imagesUrls"
        :is-pinned="pin"
        :click-pin="
            () => {
                pin = !pin;
            }
        "
    />
    <div style="width: 100vw">
        <BubbleAnswer
            :is-mine="true"
            nick-name="Jacko"
            :avatar="imagesUrls[0]"
            :text="text"
            :time-stamp="new Date().getTime()"
            :image-urls="imagesUrls"
            is-liked
            :like-count="100"
            width="30vw"
        />
        <BubbleAnswer
            :is-mine="false"
            nick-name="Jacko"
            :avatar="imagesUrls[0]"
            :text="text"
            :time-stamp="new Date().getTime()"
            :image-urls="imagesUrls"
            is-liked
            :like-count="100"
            is-teacher
            teacher-name="@苏玉鑫"
        />
    </div>
</template>

<script setup lang="ts">
import {
    BubbleQuestion,
    BubbleCard,
    BubbleAnswer,
} from "@/components/bubble-card";
import { ref } from "vue";
const imagesUrls: string[] = [
    "src/assets/default-avatar.png",
    "src/assets/default-avatar.png",
    "src/assets/default-avatar.png",
    "src/assets/default-avatar.png",
];
const title = "测试页面";
const text = "测试页面的文本内容测试页面的文本内容测试页面的文本内容测试页";
const markdowntext = `正常文字
<mark>高亮</mark>
**加粗**
*斜体*
~~删除线~~
[链接](https://www.baidu.com)
**加粗**
*斜体*
11111111111111111111111111111111
11111111111111111111111111111111
11111111111111111111111111111111
`;
const pin = ref(false);
const isFavourite = ref(false);
</script>

<style></style>
