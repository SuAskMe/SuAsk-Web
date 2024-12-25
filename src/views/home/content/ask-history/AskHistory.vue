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
              <BubbleCard v-for="(question, index) in questionList" 
              :key="question.id" 
              :id="'question-' + question.id"
              :title="question.title"
              :text="question.contents" 
              :views="question.views"
              :time-stamp="question.create_at" 
              :image-urls="question.image_urls"
              :click-card="() => navigateTo(index)" width="45vw" 
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
import { BubbleCard } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import { GetPageHistoryList, type HistoryQuestion } from "./AskHistory";
import { router } from "@/router";
import { getUserInfo } from "@/utils/userInfo";
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();
const bg_img_index = getUserInfo().themeId
const currentPage = ref(1)

const Init = async () => {
  if (questionList.length === 0) {
      loading.value = true;
      try {
          const data = await GetPageHistoryList(currentPage.value);
          questionList.push(...data);
      } catch (error) {
          console.error("获取历史记录失败:", error);
      } finally {
          loading.value = false;
      }
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
          
          currentPage.value+=1
          try {
              const data = await GetPageHistoryList(currentPage.value);
              questionList.push(...data);
          } catch (error) {
              console.error("获取历史记录失败:", error);
          } finally {
              loading.value = false;
          }
      }
  }
};


const questionList: HistoryQuestion[] = reactive([]);

const navigateTo = (key: number) => {
  console.log("key 值:", key);
  console.log("questionList:", questionList);

  if (key < 0 || key >= questionList.length) {
    console.error("key 超出范围！");
    return;
  }

  const question = questionList[key];
  if (!question) {
    console.error("没找到 未定义！");
    return;
  }

  if (!question || !question.id) {
    console.error("id 未定义！");
    return;
  }
  router.push({
      path: `/home/question-detail/${questionList[key].id}`,
  });
};

onMounted(() => {
  Init();
});
</script>

<style scoped src="./AskHistory.scss"></style>
