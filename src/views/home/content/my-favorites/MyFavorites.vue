<template>
  <el-container class="container">
    <el-main class="main-container">
      <BackgroundImg :img_index="bg_img_index" class="background-img" />
      <el-scrollbar>
        <BubbleCard v-for="(question, index) in FavoriteList" :key="question.id" :title="question.title"
          :text="question.contents" :views="question.views" :time-stamp="question.favorite_at" width="45vw" :style="{
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
import { GetPageFavoriteList } from "./MyFavorites";
import { getUserInfo } from "@/utils/userInfo";

const bg_img_index = getUserInfo().themeId
console.log(bg_img_index);
</script>

<script lang="ts">
export default {
  name: "收藏页面组件",

  created: async function () {
    // 在这里放组件的逻辑
    const data = await GetPageFavoriteList(this.currentPage);
    // const data = await GetFavoriteList();
    console.log(data);
    this.size = data.size;
    this.total = data.total;
    this.FavoriteList.push(...data.list);
  },

  methods: {
    changePage: async function () {
      this.FavoriteList = [];
      console.log("当前页：", this.currentPage);
      const data = await GetPageFavoriteList(this.currentPage);
      console.log(data);
      this.FavoriteList.push(...data.list);
    },
  },

  data: function () {
    return {
      FavoriteList: [],
      currentPage: 1,
      pageSize: 1,
      size: 1,
      total: 1,
    };
  },
};
</script>

<style scoped src="./MyFavorites.scss"></style>
