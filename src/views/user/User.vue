<template>
    <el-container style="height: 100%" class="container">
        <el-header class="user-header" height="auto">
            <QuestionHeader @return="navigateBack" :return_btn="true" />
        </el-header>
        <el-scrollbar>
            <el-main class="main-container">
                <div class="main">
                    <div class="basic-item">
                        <div class="user-profile-container">
                            <div class="section-title">
                                <p>个人信息</p>
                            </div>
                            <div class="user-profile">
                                <el-avatar :size="200" :src="userInfo.avatar">
                                    <img src="@/assets/default-avatar.png" />
                                </el-avatar>
                                <p class="nickname">{{ userInfo.nickname }}</p>
                                <p class="name">@{{ userInfo.name }}</p>
                                <p class="role">{{ roleFormat(userInfo.role) }}</p>
                            </div>
                        </div>
                        <div class="intro-container">
                            <div class="section-title">
                                <p>简介</p>
                            </div>
                            <MdPreview class="md" :id="id" :modelValue="userInfo.introduction" />
                        </div>
                    </div>
                    <div v-if="userInfo.role == 'teacher'" class="teacher-item">
                        <div class="top-question-box">
                            <div class="title">
                                <p>置顶问题</p>
                            </div>
                            <!-- <div v-if="questionList.length == 0">
                                <p class="no-pin-question">暂无置顶问题</p>
                            </div> -->
                            <!-- <div v-if="questionList.length != 0" class="question"> -->
                            <div class="question">
                                <BubbleCard
                                    class="question-item"
                                    v-for="(question, index) in questionList"
                                    :key="question.id"
                                    :title="question.title"
                                    :text="question.contents"
                                    :views="question.views"
                                    :time-stamp="question.created_at"
                                    :image-urls="question.image_urls"
                                    :bubble-key="question.id"
                                    :style="{
                                        marginTop: index === 0 ? '24px' : '0',
                                    }"
                                    width="45vw"
                                    :click-card="navigateTo"
                                    center
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-scrollbar>
    </el-container>
</template>

<script setup lang="ts">
import { getUserByIdApi } from '@/api/user/user.api'
import type { UserInfo } from '@/model/user.model'
import { BubbleCard } from '@/components/bubble-card'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { ElMessage } from 'element-plus'
import QuestionHeader from '@/components/question-header'
import { router } from '@/router'
import { getTeacherPinApi } from '@/api/teacher/teacher.api'
import type { TeacherPinItem } from '@/model/teacher.model'

const id = 'preview-only'

const userInfo = ref<UserInfo>({
    id: 0,
    name: '',
    nickname: '',
    role: '',
    introduction: '',
    avatar: null,
})

const route = useRoute()

async function getUserInfo() {
    const userId = route.params.id.toString()
    await getUserByIdApi(userId)
        .then((res) => {
            if (res) {
                userInfo.value = res
            } else {
                ElMessage.error('获取用户信息失败')
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

function navigateBack() {
    history.back()
}

const navigateTo = (key: number) => {
    router.push({
        path: `/question-detail/${key}`,
    })
}

onMounted(async () => {
    await getUserInfo()
    if (userInfo.value.role == 'teacher') {
        await getPinQuestion()
    }
})

const questionList = ref<TeacherPinItem[]>([])

async function getPinQuestion() {
    await getTeacherPinApi(userInfo.value.id)
        .then((res) => {
            if (res) {
                questionList.value = res.question_list
            } else {
                ElMessage.error('获取置顶问题失败')
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

function roleFormat(role: string) {
    switch (role) {
        case 'student':
            return '学生'
        case 'teacher':
            return '教师'
        case 'admin':
            return '管理员'
        default:
            return '未知'
    }
}
</script>

<style scoped lang="scss" src="./user-page.scss"></style>
