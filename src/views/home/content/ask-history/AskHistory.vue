<!-- <template>
  <el-container class="container">
    <el-main class="main-container">
      <BackgroundImg :img_index="bg_img_index" class="background-img" />
      <el-scrollbar>
        <BubbleCard v-for="(question, index) in HistoryList" 
        :key="question.id" 
        :title="question.title"
        :text="question.contents" 
        :views="question.views" 
        :time-stamp="question.created_at"
        :image-urls="question.image_urls" width="45vw" 
        :style="{
          marginTop: index === 0 ? '24px' : '0',
          }" />
        <el-pagination class="pagination-bottom" layout="prev, pager, next" :page-size="size" :total="total"
          v-model:current-page="currentPage" @current-change="changePage"></el-pagination>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import BackgroundImg from "@/components/backgroud-img";
import { BubbleCard } from "@/components/bubble-card";
import { GetPageHistoryList } from "./AskHistory";
import { getUserInfo } from "@/utils/userInfo";
import { router } from "@/router";
const bg_img_index = getUserInfo().themeId
console.log(bg_img_index);
</script>

<script lang="ts">
export default {
  name: "页面组件",

  created: async function () {
    // 在这里放组件的逻辑
    const data = await GetPageHistoryList(this.currentPage);
    // const data = await GetHistoryList();
    console.log(data);
    this.size = data.size;
    this.total = data.total;
    this.HistoryList.push(...data.list);
  },

  methods: {
    changePage: async function () {
      this.HistoryList = [];
      console.log("当前页：", this.currentPage);
      const data = await GetPageHistoryList(this.currentPage);
      console.log(data);
      this.HistoryList.push(...data.list);
    },
  },

  data: function () {
    return {
      HistoryList: [],
      currentPage: 1,
      pageSize: 1,
      size: 1,
      total: 1,
    };
  },

  // const navigateTo = (key: number) => {
  //   router.push({
  //       path: `question-detail/${HistoryList[key].id}`,
  //   });
  // },

};
</script>

<style scoped src="./AskHistory.scss"></style> -->

<template>
  <el-container class="container">
      <el-main class="main-container">
          <BackgroundImg :img_index="bg_img_index" class="background-img" />
          <el-scrollbar v-loading="loading" ref="scrollBar" @scroll="handleScroll">
              <BubbleQuestion v-for="(question, index) in questionList" 
              :key="question.id" 
              :title="question.title"
              :text="question.contents" 
              :views="question.views"
              :time-stamp="question.created_at" 
              :image-urls="question.image_urls"
              :click-card="navigateTo" width="45vw" 
              :style="{
                      marginTop: index === 0 ? '24px' : '0',
                  }" />
          </el-scrollbar>
      </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { ElScrollbar } from "element-plus";
import { BubbleQuestion } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { GetPageHistoryList, type HistoryQuestion } from "./AskHistory";
import { router } from "@/router";
import { getUserInfo } from "@/utils/userInfo";
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();
const bg_img_index = getUserInfo().themeId

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
          questionList.push(...(await GetPageHistoryList(0)));
          loading.value = false;
      }
  }
};


const questionList: HistoryQuestion[] = reactive([]);

const navigateTo = (key: number) => {
  router.push({
      path: `question-detail/${questionList[key].id}`,
  });
};

onMounted(() => {
  Init();
});
</script>

<style scoped src="./AskHistory.scss"></style>
