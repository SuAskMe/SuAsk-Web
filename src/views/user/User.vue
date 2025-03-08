<template>
    <el-container style="height: 100%;">
        <el-header class="header" height="auto">
            <QuestionHeader @return="navigateBack" :return_btn="true" />
        </el-header>
        <el-main class="main">
            <el-scrollbar>
                <div class="main-item">
                    <el-avatar :size="200" :src="userInfo.avatar">
                        <img src="@/assets/default-avatar.png" />
                    </el-avatar>
                    <p class="nickname">{{ userInfo.nickname }}</p>
                    <p class="name">@{{ userInfo.name }}</p>
                    <MdPreview class="md" :id="id" :modelValue="userInfo.introduction" />
                </div>
                <div v-if="userInfo.role == 'teacher'" class="teacher-item">
                    <div class="title">
                        <p>置顶问题</p>
                        <!-- <p>{{ questionList.length }}</p> -->
                    </div>
                    <div class="question">
                        <el-scrollbar>
                            <BubbleCard class="question-item" v-for="(question, index) in questionList"
                                :key="question.id" :title="question.title" :text="question.contents"
                                :views="question.views" :time-stamp="question.created_at"
                                :image-urls="question.image_urls" :bubble-key="question.id" :style="{
                                    marginTop: index === 0 ? '24px' : '0',
                                }" width="45vw" :click-card="navigateTo" />
                        </el-scrollbar>
                    </div>
                </div>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang='ts'>
import { getUserByIdApi } from '@/api/user/user.api';
import type { UserInfo } from '@/model/user.model';
import { BubbleCard } from '@/components/bubble-card';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { ElMessage } from 'element-plus';
import QuestionHeader from '@/components/question-header';
import { router } from '@/router';
import { getTeacherPinApi } from '@/api/teacher/teacher.api';
import type { TeacherPinItem } from '@/model/teacher.model';

// md-editor
const id = 'preview-only';

// user info
const userInfo = ref<UserInfo>({
    id: 0,
    name: '',
    nickname: '',
    role: '',
    introduction: '',
    avatar: null,
});

const route = useRoute();

async function getUserInfo() {
    const userId = route.params.id.toString();
    await getUserByIdApi(userId).then(res => {
        if (res) {
            userInfo.value = res;
            console.log(userInfo.value);
        } else {
            ElMessage.error('获取用户信息失败');
        }
    }).catch(err => {
        console.log(err);
    });
}

function navigateBack() {
    history.back();
}

const navigateTo = (key: number) => {
    console.log(key);
    router.push({
        path: `/question-detail/${key}`,
    });
};

onMounted(async () => {
    await getUserInfo();
    if (userInfo.value.role == 'teacher') {
        await getPinQuestion();
    }
});


const questionList = ref<TeacherPinItem[]>([]);

async function getPinQuestion() {
    await getTeacherPinApi(userInfo.value.id).then(res => {
        if (res) {
            questionList.value = res.question_list;
        } else {
            ElMessage.error('获取置顶问题失败');
        }
    }).catch(err => {
        console.log(err);
    });
}
</script>

<style scoped lang="scss">
.main {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;

    .main-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        .nickname {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            margin: 0;
            margin-top: 10px;
        }

        .name {
            font-size: 18px;
            color: #666;
            margin-top: 10px;
            margin: 0;
            margin-top: 10px;
        }

    }

    .teacher-item {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        height: 100%;


        .title {
            display: flex;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .question {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;

            .question-item {
                cursor: pointer;
            }
        }
    }
}
</style>