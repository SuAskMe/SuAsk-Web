<template>
    <el-container class="container">
        <el-header style="height: auto">
            <QuestionHeader
                @change-sort="changeSort"
                @return="navigateBack"
                :return_btn="true"
                :defualt_sort_type="1"
                has_sort_upvote
                sort_and_search
            />
        </el-header>
        <el-main class="main-container">
            <BackgroundImg :img_index="bg_img_index" class="background-img" />
            <el-scrollbar>
                <Transition name="question" appear>
                    <BubbleCard
                        :title="question.title"
                        :text="question.contents"
                        :views="question.views"
                        :time-stamp="question.created_at"
                        :image-urls="question.image_urls"
                        :show-favorite="true"
                        :is-favorite="question.is_favorite"
                        width="45vw"
                        style="margin-top: 24px"
                        :click-card="() => {}"
                        :click-favorite="favorite"
                    >
                    </BubbleCard>
                </Transition>
                <TransitionGroup name="answer" tag="div">
                    <BubbleAnswer
                        v-for="(item, index) in answerList"
                        :key="item.id"
                        class="answer-card"
                        :id="'answer-' + item.id"
                        :is-mine="item.user_id == userId"
                        :avatar="item.user_avatar"
                        :nick-name="item.nickname"
                        :text="item.contents"
                        :like-count="item.upvotes"
                        :is-liked="item.is_upvoted"
                        :time-stamp="item.created_at"
                        :quote="getQuote(item.in_reply_to)"
                        :image-urls="item.image_urls"
                        :is-teacher="item.teacher_name != ''"
                        :teacher-name="item.teacher_name"
                        :bubble-key="{
                            idx: index,
                            quoteId: item.in_reply_to,
                            userId: item.user_id,
                            answerId: item.id,
                        }"
                        width="35vw"
                        :click-quote="scrollToQuote"
                        :click-like="upvote"
                        :click-card="openDialog"
                        :click-avatar="navigateToUser"
                    >
                    </BubbleAnswer>
                </TransitionGroup>
            </el-scrollbar>
            <!-- <transition-group class="image-container" tag="div" name="fade-list" move-class="fade-list-move">
                <div class="picked-image" v-for="(img, index) in imageList" :key="img.id" :id="'image-' + img.id">
                    <el-image @click.stop :src="img.url" :preview-src-list="[img.url]" class="image" fit="cover"
                        preview-teleported></el-image>
                    <div class="delete-btn" @click.stop="deleteImage(index)">
                        <SvgIcon icon="delete-round" color="#FF5F96" size="16px"></SvgIcon>
                    </div>
                </div>
            </transition-group> -->
        </el-main>
        <answer-dialog
            v-model:visible="showDialog"
            :question-id="question.id"
            :quote="quote"
            @answer-posted="handleAnswerPosted"
        ></answer-dialog>
        <div
            v-if="canReply"
            class="ask-btn"
            @click.stop="openDialog(undefined)"
        >
            <el-icon size="30" color="#fff">
                <Plus />
            </el-icon>
        </div>
        <!-- <el-footer v-if="canReply" style="height: auto">
            <Footer :question_id="question.id" v-model:file-list="fileList" v-model:image-list="imageList"></Footer>
        </el-footer> -->
    </el-container>
</template>

<script setup lang="ts">
import { BubbleAnswer, BubbleCard } from "@/components/bubble-card";
import QuestionHeader from "@/components/question-header";
import BackgroundImg from "@/components/backgroud-img";
import { Favorite, scrollToQuote } from "./QuestionDetail";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import SvgIcon from "@/components/svg-icon";
import { useRoute } from "vue-router";
import { router } from "@/router";
import { getAnswerApi, upvoteAnswerApi } from "@/api/answer/answer.api";
import type {
    AnswerItem,
    Question,
    UpvoteAnswerReq,
    UpvoteAnswerRes,
} from "@/model/answer.model";
import { AnswerDialog } from "@/components/ask-and-answer-dialog";
import { ElMessage } from "element-plus";
import { favoriteApi } from "@/api/question/favorite.api";
import { storeToRefs } from "pinia";
import { UseQDMessageStore } from "@/store/modules/question-detail";

import { UserStore } from "@/store/modules/user";

// 背景图片
// let bg_img_index = ref(getUserInfo().themeId);
// const userStore = UserInfoStore();

// 背景图片
const userStore = UserStore();
const bg_img_index = computed(() => userStore.getUser().themeId);
const { userInfo } = storeToRefs(userStore);

// interface Img {
//     id: number;
//     url: string;
// }
const route = useRoute();
// const answerList: AnswerItem[] = reactive([]);
// const fileList = ref<File[]>([]);
// const imageList = ref<Img[]>([]);

// const deleteImage = (index: number) => {
//     fileList.value.splice(index, 1);
//     imageList.value.splice(index, 1);
// };
let sort_type = 1;

const changeSort = (index: number) => {
    sort_type = index;
    switch (index) {
        case 0:
            answerList.value.sort((a, b) => b.created_at - a.created_at);
            break;
        case 1:
            answerList.value.sort((a, b) => a.created_at - b.created_at);
            break;
        case 2:
            answerList.value.sort((a, b) => b.upvotes - a.upvotes);
            break;
        case 3:
            answerList.value.sort((a, b) => a.upvotes - b.upvotes);
            break;
        default:
            break;
    }
};

const navigateBack = () => {
    router.go(-1);
};

function navigateToUser(key: { userId: number }) {
    router.push("/user/" + key.userId);
}

onMounted(async () => {
    document.title = "加载中...";
    await getAnswerList();
    document.title = question.value.title;
    if (route.hash) {
        console.log(parseInt(route.hash.replace("#", "")));
        scrollToAnswer(parseInt(route.hash.replace("#", "")));
    }
});

const observe = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.animate(
                    [{ background: "#80808050" }, { background: "#80808000" }],
                    { duration: 1500, easing: "ease-in-out", iterations: 1 }
                );
            }
        });
    },
    { threshold: 1.0 }
);

function scrollToAnswer(id: number) {
    nextTick(() => {
        const el = document.getElementById(`answer-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            observe.observe(el);
            setTimeout(() => {
                observe.unobserve(el);
            }, 2000);
        }
    });
}

const showDialog = ref(false);
const ErrorMsg = UseQDMessageStore();
async function getAnswerList() {
    await getAnswerApi(parseInt(route.params.id as string))
        .then((res) => {
            if (res) {
                answerList.value = res.data.answer_list;
                question.value = res.data.question;
                canReply.value = res.data.can_reply;
            } else {
                ElMessage.error("没有权限");
                ErrorMsg.setErr();
                navigateBack();
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function getQuote(in_reply_to: number) {
    let answer = answerList.value.find((item) => item.id === in_reply_to);
    if (!answer) return undefined;
    return {
        text: answer.contents,
        author: answer.nickname,
        avatar: answer.user_avatar,
    };
}

interface Quote {
    in_replay_to: number;
    avatar: string;
    author: string;
    text: string;
}

const quote = ref<Quote>({
    in_replay_to: 0,
    avatar: "",
    text: "",
    author: "",
});

function openDialog(key?: { answerId: number }) {
    if (key) {
        quote.value.in_replay_to = key.answerId;
        let tmp = getQuote(key.answerId);
        if (tmp) {
            quote.value.author = tmp.author;
            quote.value.avatar = tmp.avatar;
            quote.value.text = tmp.text;
        }
    } else {
        quote.value.in_replay_to = 0;
        quote.value.author = "";
        quote.value.avatar = "";
        quote.value.text = "";
    }
    showDialog.value = true;
}

async function handleAnswerPosted(answer: AnswerItem) {
    // console.log(answer_id);
    // await getAnswerList();
    answerList.value.push(answer);
    changeSort(sort_type);
    nextTick(() => {
        const el = document.getElementById(`answer-${answer.id}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            observe.observe(el);
            setTimeout(() => {
                observe.unobserve(el);
            }, 2000);
        }
    });
}

async function upvote(key: { answerId: number }) {
    let req: UpvoteAnswerReq = {
        question_id: question.value.id,
        answer_id: key.answerId,
    };

    let data: UpvoteAnswerRes;
    await upvoteAnswerApi(req)
        .then((res) => {
            if (res) {
                data = res.data;
                answerList.value = answerList.value.map((answer) => {
                    if (answer.id == req.answer_id) {
                        return {
                            ...answer,
                            upvotes: data.upvote_num,
                            is_upvoted: data.is_upvoted,
                        };
                    }
                    return answer;
                });
            } else {
                console.log("Error", res);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

async function favorite(key: number) {
    key = Number(key);
    // let res = await Favorite(question.value.id);
    let res = await favoriteApi({ question_id: question.value.id });
    if (res == null) {
        ElMessage.error("用户未登录");
        return;
    }
    question.value.is_favorite = res.is_favorite;
}

const answerList = ref<AnswerItem[]>([]);
const question = ref<Question>({
    id: 0,
    title: "",
    contents: "",
    views: 0,
    created_at: 0,
    image_urls: [],
    is_favorite: false,
});
const canReply = ref<boolean>(false);
const userId = userInfo.value ? userInfo.value.id : 0;
</script>

<style scoped src="./QuestionDetail.scss"></style>
