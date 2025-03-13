<template>
    <el-container class="help-container">
        <el-header class="help-header">
            <QuestionHeader @sidebar="sidebar" sidebar_btn> </QuestionHeader>
            <div class="help-title">
                <p>帮助</p>
            </div>
        </el-header>
        <el-main class="help-main">
            <el-scrollbar>
                <div class="help-content">
                    <el-card class="help-card intro-card" shadow="hover">
                        <h1>SuAsk • 速问</h1>
                        <el-image
                            src="https://github.com/user-attachments/assets/68cbe1a7-1d9a-4487-a639-c86c15fbf6e9"
                        />
                        <p class="intro-text">
                            一个匿名提问箱，为了解决<del>苏老师</del>匿名提问箱经常跑路的问题
                        </p>
                    </el-card>

                    <el-card class="help-card feature-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <h2>它可以实现什么</h2>
                            </div>
                        </template>
                        <el-image
                            src="https://github.com/user-attachments/assets/a87d6177-c133-469e-8de1-f8d574bc923f"
                        />
                        <ul class="feature-list">
                            <li>
                                <el-icon><Check /></el-icon>
                                完全匿名，用户可以畅所欲言，后台不会对用户信息进行记录
                            </li>
                            <li>
                                <el-icon><Check /></el-icon> 公开论坛，用户可以自由发表提问
                            </li>
                            <li>
                                <el-icon><Check /></el-icon>
                                教师匿名提问箱，用户可以匿名提问教师问题，内置学院教师信息，开箱即用
                            </li>
                            <li>
                                <el-icon><Check /></el-icon> 提醒功能，你不会错过任何一条有关信息
                            </li>
                        </ul>
                    </el-card>

                    <el-card class="help-card qa-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <h2>Q&A</h2>
                            </div>
                        </template>
                        <div class="qa-item" v-for="(item, index) in qaItems" :key="index">
                            <h3>{{ item.question }}</h3>
                            <p v-html="item.answer"></p>
                        </div>
                    </el-card>
                </div>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { SidebarStore } from '@/store/modules/sidebar'
import { Check } from '@element-plus/icons-vue'
import { ref } from 'vue'

const sidebarStore = SidebarStore()
const sidebar = () => {
    sidebarStore.toggle()
}

const qaItems = ref([
    {
        question: 'Q: 为什么要创建这个项目？',
        answer: 'A: 学院的苏老师深受商用匿名提问箱跑路的迫害，<del>据他所说已经用跑路了3个</del>，便希望我们开发一个属于学院的匿名提问箱',
    },
    {
        question: 'Q: 为什么使用go-frame？',
        answer: 'A: 这个项目本质上还是本专业的中级实训大作业，当时指明要求使用go语言来编写后端，而go-frame是一个较成熟的框架，便采用了',
    },
    {
        question: 'Q: 我发现了bug怎么办？',
        answer: 'A: 欢迎提交<a href="https://github.com/DreamingLri/SuAsk/issues/new" class="qa-link">Issue</a>',
    },
])
</script>

<style scoped lang="scss" src="./help.scss"></style>
