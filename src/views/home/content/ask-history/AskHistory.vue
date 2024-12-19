<template>
    <el-container class="container">
      <el-main class="main-container">
        <BackgroundImg img_index="1" class="background-img" />
        <el-scrollbar>
          <BubbleCard
            v-for="(question, index) in HistoryList"
            :key="question.id"
            :title="question.title"
            :text="question.contents"
            :views="question.views"
            :time-stamp="question.created_at"
            :image-urls="question.image_urls"
            width="45vw"
            :style="{
              marginTop: index === 0 ? '24px' : '0',
            }"
          />
          <el-pagination
            class="pagination-bottom"
            layout="prev, pager, next"
            :page-size="size"
            :total="total"
            v-model:current-page="currentPage"
            @current-change="changePage"
          ></el-pagination>
        </el-scrollbar>
      </el-main>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import BackgroundImg from "@/components/backgroud-img";
  import { BubbleCard } from "@/components/bubble-card";
  import { GetPageHistoryList } from "./AskHistory";
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
  };
  </script>
  
  <style scoped src="./AskHistory.scss"></style>
  