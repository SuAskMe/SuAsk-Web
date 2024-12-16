<template>
    <el-container class="container">
        <el-main class="main-container">
            <BackgroundImg img_index="1" class="background-img" />
            <el-scrollbar
                v-loading="loading"
                ref="scrollBar"
                @scroll="handleScroll"
            >
                <!-- 修改字段后，气泡会显示出来，刷新又消失了？？ -->
                <BubbleCard
                    v-for="(question, index) in FavoriteList"
                    :key="question.id"
                    :title="question.title"
                    :text="question.contents"
                    :views="question.views"
                    :time-stamp="question.favorite_at"

                    width="45vw"
                    :style="{
                        marginTop: index === 0 ? '24px' : '0',
                    }"
                />
            </el-scrollbar>
            <AskDialog v-model:visible="showDialog" />
            <!-- <div class="ask-btn" @click.stop="showDialog = true">+</div> -->
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElScrollbar } from "element-plus";
import { BubbleCard } from "@/components/bubble-card";
import BackgroundImg from "@/components/backgroud-img";
import AskDialog from "@/components/ask-dialog";
import type { FavoriteQuestion } from "./MyFavorites";
import { GetFavoriteList } from "./MyFavorites";
import { da } from "element-plus/es/locale";

const showDialog = ref(false);
const loading = ref(false);
const scrollBar = ref<InstanceType<typeof ElScrollbar>>();

const FavoriteList: FavoriteQuestion[] = []; // 非响应式数组

onMounted(async () => {
  // 填充数据到 FavoriteList，非响应式数据
  console.log("start");

  loading.value = true;
  const data = await GetFavoriteList();
  FavoriteList.push(...data);
  loading.value = false;

  console.log("FavoriteList: ", FavoriteList);
});

// const handleScroll = async () => {
//     if (scrollBar.value) {
//         const scrollTop = scrollBar.value.wrapRef?.scrollTop;
//         const clientHeight = scrollBar.value.wrapRef?.clientHeight;
//         const scrollHeight = scrollBar.value.wrapRef?.scrollHeight;
//         if (
//             scrollTop &&
//             clientHeight &&
//             scrollHeight &&
//             Math.ceil(scrollTop + clientHeight) >= scrollHeight &&
//             loading.value === false
//         ) {
//             loading.value = true;
//             FavoriteList.push(...(await GetFavoritesList())); // 存疑，这里可能会有问题
//             loading.value = false;
//         }
//     }
// };
</script>

<style scoped src="./MyFavorites.scss"></style>
