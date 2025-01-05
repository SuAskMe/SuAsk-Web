<script setup lang="ts">
import { onMounted, ref } from "vue";
import "md-editor-v3/lib/style.css";
import SvgIcon from "@/components/svg-icon";
import { ElMessage } from "element-plus";
import { GenId } from "@/views/question-detail/QuestionDetail";
import { getUserInfo } from "@/utils/userInfo";
import ImgList from "./ImgList.vue";

const visible = defineModel("visible", { default: false });
const isDraft = ref(false);
const innerVisible = ref(false);

async function openDraft() {
    isDraft.value = true;
    await getDrafts();
}

function handleClose(done: () => void) {
    if (isDraft.value) {
        done();
        setTimeout(() => {
            isDraft.value = false;
            deleteMod.value = false;
        }, 300);
        clearAnswerContent();
    } else if (
        answerContent.value.content == "" &&
        answerContent.value.fileList.length == 0
    ) {
        done();
    } else {
        innerVisible.value = true;
    }
}

function saveDraft() {
    addDraft();
    innerVisible.value = false;
    visible.value = false;
}

function clearAnswerContent() {
    answerContent.value.content = "";
    answerContent.value.fileList = [];
    answerContent.value.imageList = [];
}

function cancelSaveDraft() {
    innerVisible.value = false;
    visible.value = false;
    clearAnswerContent();
}

const props = defineProps<{
    fullscreen?: boolean;
    questionId: number;
    quote?: Quote;
}>();

interface Quote {
    in_replay_to: number;
    avatar: string;
    author: string;
    text: string;
}

interface Img {
    id: number;
    url: string;
}

interface Ask {
    draftId?: number;
    content: string;
    fileList: File[];
    imageList: Img[];
}

const answerContent = ref<Ask>({
    draftId: undefined,
    content: "",
    fileList: [],
    imageList: [],
});

const userInfo = getUserInfo();
const avatarURL = userInfo ? userInfo.avatar : "@/assets/default-avatar.png";

const hoverColor = ref("#000000");

const imgPicker = ref<HTMLInputElement>();
const pickImage = () => {
    if (imgPicker.value) {
        imgPicker.value.click();
    }
};

const pickImageImpl = (event: any) => {
    if (answerContent.value.fileList && answerContent.value.imageList) {
        const files = event.target.files;
        if (answerContent.value.fileList.length + files.length > 8) {
            ElMessage.error("最多只能上传8张图片");
            return;
        }
        answerContent.value.fileList.push(...files);
        for (let i = 0; i < files.length; i++) {
            answerContent.value.imageList.push({
                id: GenId(),
                url: URL.createObjectURL(files[i]),
            });
        }
        if (imgPicker.value) imgPicker.value.value = "";
        console.log(
            answerContent.value.fileList,
            answerContent.value.imageList
        );
    }
};

const deleteImage = (index: number) => {
    answerContent.value.fileList.splice(index, 1);
    answerContent.value.imageList.splice(index, 1);
};

// 草稿
import { db, type Answer } from "./db";
import type { AddAnswer, AnswerItem } from "@/model/answer.model";
import { addAnswerApi } from "@/api/answer/answer.api";

const deleteDrafts = ref<number[]>([]);
const deleteMod = ref(false);

function handleDeleteMod() {
    if (deleteMod.value) {
        deleteDrafts.value = [];
    }
    deleteMod.value = !deleteMod.value;
}

const drafts = ref<Answer[]>([]);
const isSelectAll = ref(true);

function handleCheckAllChange() {
    if (isSelectAll.value) {
        deleteDrafts.value = drafts.value.map((draft) => draft.id);
    } else {
        deleteDrafts.value = [];
    }
    isSelectAll.value = !isSelectAll.value;
    console.log(deleteDrafts.value);
}

function useDraft(draft: Answer) {
    // unchanged
    if (deleteMod.value) return;
    answerContent.value.content = draft.content;
    answerContent.value.fileList = [];
    answerContent.value.imageList = [];
    for (const img of draft.imgList) {
        answerContent.value.imageList.push({
            id: GenId(),
            url: URL.createObjectURL(img),
        });
        const file = img as File;
        answerContent.value.fileList.push(
            new File([file], file.name, { type: file.type })
        );
    }
    answerContent.value.draftId = draft.id;
    isDraft.value = false;
}

async function addDraft() {
    let imgList: Blob[] = [];
    for (const file of answerContent.value.fileList) {
        imgList.push(file);
    }
    try {
        const id = await db.answers.add({
            time: new Date(),
            imgList: imgList,
            content: answerContent.value.content,
            question_id: props.questionId,
            in_reply_to: props.quote?.in_replay_to,
        });
        console.log("Draft added with id", id);
    } catch (error) {
        console.error("Error adding draft", error);
    }
}

async function getDrafts() {
    try {
        drafts.value = await db.answers.reverse().toArray();
        console.log("Drafts got", drafts.value);
    } catch (error) {
        console.error("Error getting drafts", error);
    }
}

async function deleteDraft(id: number | number[]) {
    try {
        if (typeof id === "number") {
            await db.answers.delete(id);
            console.log("Draft deleted with id", id);
        } else {
            for (const draftId of id) {
                await db.answers.delete(draftId);
                console.log("Draft deleted with id", draftId);
            }
        }
        await getDrafts();
    } catch (error) {
        console.error("Error deleting drafts", error);
    }
}

const emit = defineEmits(["answerPosted"]);

async function postAnswer() {
    // let userId = getUserInfo().id ? getUserInfo().id : null;
    console.log(answerContent.value.fileList);

    let formData = new FormData();
    let imgList: string[] = [];
    answerContent.value.fileList.forEach((file: File) => {
        formData.append("files", file);
        imgList.push(URL.createObjectURL(file));
    });

    let req: AddAnswer = {
        question_id: props.questionId,
        in_reply_to: props.quote?.in_replay_to,
        content: answerContent.value.content,
    };

    formData.append("question_id", req.question_id.toString());
    if (req.in_reply_to) {
        formData.append("in_reply_to", req.in_reply_to.toString());
    }
    formData.append("content", req.content);

    await addAnswerApi(formData).then((res) => {
        if (res) {
            ElMessage.success("回复成功");
            visible.value = false;
            if (answerContent.value.draftId) {
                deleteDraft(answerContent.value.draftId);
            }
            let ans: AnswerItem = {
                id: res.data.id,
                user_id: userInfo.id ? userInfo.id : 1,
                user_avatar: userInfo.avatar
                    ? userInfo.avatar
                    : "@/assets/default-avatar.png",
                contents: req.content,
                created_at: new Date().getTime(),
                in_reply_to: req.in_reply_to ? req.in_reply_to : 0,
                upvotes: 0,
                image_urls: imgList,
                is_upvoted: false,
                teacher_name: userInfo.role == "teacher" ? userInfo.name : "",
                nickname: userInfo.nickname ? userInfo.nickname : "匿名用户",
            };
            emit("answerPosted", ans);
            clearAnswerContent();
        } else {
            ElMessage.error("回复失败");
        }
    });
}
</script>

<template>
    <div class="dialog">
        <el-dialog
            v-model="visible"
            :fullscreen="fullscreen"
            width="600px"
            :show-close="false"
            :before-close="handleClose"
            align-center
        >
            <!-- 正文 -->
            <template v-if="!isDraft" #header="{ close }">
                <div class="header">
                    <el-icon
                        @click="close"
                        size="20px"
                        :color="hoverColor"
                        @mouseover="hoverColor = '#71b6ff'"
                        @mouseleave="hoverColor = '#000000'"
                    >
                        <Close />
                    </el-icon>
                    <el-button @click="openDraft" type="primary" round text
                        >草稿</el-button
                    >
                </div>
            </template>
            <div v-if="!isDraft">
                <div
                    v-if="props.quote?.in_replay_to != 0"
                    class="quote-container"
                >
                    <div class="quote">
                        <div class="avatar">
                            <el-avatar :src="props.quote?.avatar" :size="40">
                                <img src="@/assets/default-avatar.png" />
                            </el-avatar>
                        </div>
                        <div class="content">
                            <div class="author">{{ props.quote?.author }}</div>
                            <div class="text">{{ props.quote?.text }}</div>
                        </div>
                    </div>
                    <div class="middle">
                        <div class="line" />
                        <p>回复</p>
                    </div>
                </div>
                <div class="input-container">
                    <div class="avatar">
                        <el-avatar :src="avatarURL" :size="40">
                            <img src="@/assets/default-avatar.png" />
                        </el-avatar>
                    </div>
                    <div class="content">
                        <el-input
                            v-model="answerContent.content"
                            :autosize="{ minRows: 6, maxRows: 8 }"
                            type="textarea"
                            placeholder="发表新回复..."
                        />
                    </div>
                </div>

                <transition-group
                    class="image-container"
                    tag="div"
                    name="fade-list"
                    move-class="fade-list-move"
                >
                    <div
                        class="picked-image"
                        v-for="(img, index) in answerContent.imageList"
                        :key="img.id"
                        :id="'image-' + img.id"
                    >
                        <el-image
                            @click.stop
                            :src="img.url"
                            :preview-src-list="[img.url]"
                            class="image"
                            fit="cover"
                            preview-teleported
                        ></el-image>
                        <div
                            class="delete-btn"
                            @click.stop="deleteImage(index)"
                        >
                            <SvgIcon
                                icon="delete-round"
                                color="#FF5F96"
                                size="16px"
                            ></SvgIcon>
                        </div>
                    </div>
                </transition-group>
                <hr class="line" />
                <div class="footer">
                    <SvgIcon
                        @click.stop="pickImage"
                        icon="image"
                        size="24px"
                        color="#71b6ff"
                        style="cursor: pointer"
                    />
                    <input
                        type="file"
                        ref="imgPicker"
                        accept="image/png,image/jpeg,image/jpg"
                        style="display: none"
                        @change="pickImageImpl"
                        multiple
                    />
                    <el-button
                        @click="postAnswer"
                        type="primary"
                        round
                        color="#71b6ff"
                        style="color: white"
                        >发布</el-button
                    >
                </div>
            </div>
            <!-- 草稿 -->
            <template v-if="isDraft" #header>
                <div class="header">
                    <div
                        style="
                            display: flex;
                            align-items: center;
                            font-weight: bold;
                            font-size: 20px;
                        "
                    >
                        <el-icon
                            @click="isDraft = false"
                            size="20px"
                            :color="hoverColor"
                            @mouseover="hoverColor = '#71b6ff'"
                            @mouseleave="hoverColor = '#000000'"
                        >
                            <ArrowLeft />
                        </el-icon>
                        <p>草稿</p>
                    </div>
                    <el-button
                        v-if="!deleteMod"
                        @click="handleDeleteMod"
                        type="primary"
                        round
                        color="#71b6ff"
                        style="color: white"
                        >编辑</el-button
                    >
                    <el-button
                        v-if="deleteMod"
                        @click="handleDeleteMod"
                        type="primary"
                        round
                        color="#71b6ff"
                        style="color: white"
                        >完成</el-button
                    >
                </div>
            </template>
            <div v-if="isDraft">
                <el-checkbox-group
                    v-model="deleteDrafts"
                    class="draft"
                    v-if="drafts.length != 0"
                >
                    <div v-for="draft in drafts" :key="draft.id" class="border">
                        <div @click="useDraft(draft)" class="draft-card">
                            <div class="text-space">
                                <p class="content">{{ draft.content }}</p>
                            </div>
                            <img-list
                                v-if="draft.imgList.length != 0"
                                :img-list="draft.imgList"
                            ></img-list>
                        </div>
                        <el-checkbox v-if="deleteMod" :value="draft.id" />
                    </div>
                </el-checkbox-group>
                <div v-if="deleteMod" class="footer">
                    <el-button
                        @click="handleCheckAllChange"
                        type="primary"
                        size="small"
                        round
                        color="#71b6ff"
                        style="color: white"
                        >全选</el-button
                    >
                    <el-button
                        @click="deleteDraft(deleteDrafts)"
                        type="danger"
                        size="small"
                        round
                        :disabled="deleteDrafts.length == 0"
                        >删除</el-button
                    >
                </div>
                <div v-if="drafts.length == 0">
                    <p>暂无草稿</p>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            v-model="innerVisible"
            width="300px"
            :show-close="false"
            align-center
        >
            <template #header style="padding: 0">
                <p style="margin: 0; font-size: 20px; padding: 0 20px">
                    保存为草稿?
                </p>
            </template>
            <div class="inner-dialog">
                <p>你可以保存此内容，以便之后从草稿发布</p>
                <el-button @click="saveDraft" type="primary" round
                    >保存</el-button
                >
                <el-button
                    @click="cancelSaveDraft"
                    style="margin: 0; margin-top: 10px"
                    type="default"
                    round
                    >取消</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.dialog {
    display: flex;
    flex-direction: column;
    --el-border-color: white !important;
    --el-border-color-hover: white !important;
    width: 100%;

    .header {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        justify-content: space-between;

        p {
            margin: 0;
            margin-left: 8px;
        }
    }

    .quote-container {
        display: flex;
        width: 100%;
        flex-direction: column;

        .quote {
            display: flex;
            width: 100%;

            .avatar {
                margin-right: 10px;
            }

            .content {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .author {
                    font-weight: bold;
                    font-size: 16px;
                    line-height: 16px;
                }

                .text {
                    margin-top: 5px;
                    font-size: 14px;
                    line-height: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 400px;
                }
            }
        }

        .middle {
            display: flex;
            align-items: center;
            margin: 10px 0;

            p {
                margin: 0;
                margin-left: 30px;
                font-size: 14px;
                line-height: 14px;
            }

            .line {
                border-left: 2px solid $su-blue;
                height: 30px;
                width: 0;
                margin: 0;
                margin-left: 19px;
            }
        }
    }

    .input-container {
        display: flex;
        width: 100%;

        .avatar {
            margin-right: 10px;
            padding-top: 5px;
        }

        .content {
            margin-top: 10px;
            width: 100%;

            :deep(.el-textarea__inner) {
                resize: none !important;
                padding: 5px 0 !important;
            }

            .el-textarea {
                --el-input-focus-border-color: white !important;
            }
        }
    }

    .line {
        border-top: 1px solid $su-blue;
        margin-top: 10px;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }

    .inner-dialog {
        display: flex;
        flex-direction: column;
        padding: 0 20px;
    }

    .draft {
        line-height: auto;
        width: 100%;

        .border {
            display: flex;
            border-top: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
        }

        .draft-card {
            display: inline-flex;
            width: 100%;
            justify-content: space-between;
            padding: 10px;

            .text-space {
                width: 400px;
                display: flex;
                flex-direction: column;

                .title {
                    padding-top: 10px;
                    font-size: 16px;
                    line-height: 16px;
                    font-weight: bold;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .content {
                    padding-top: 5px;
                    line-height: 14px;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            img-list {
                width: 100%;
            }

            p {
                margin: 0;
            }
        }
    }

    .image-container {
        bottom: 0;
        padding: 8px 0px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
        width: 100%;
        pointer-events: none;

        .picked-image {
            width: 15%;
            pointer-events: all;
            display: flex;
            justify-content: flex-end;

            .delete-btn {
                margin-top: -7px;
                margin-left: -12px;
                background-color: #fff;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 2px;
                z-index: 1;
            }

            .image {
                width: 100%;
                aspect-ratio: 1/1;
                border-radius: 6px;
                border: solid 2px #fff;
                cursor: pointer;
            }
        }
    }
}

:deep(.el-dialog) {
    border-radius: 20px;
}

:deep(.el-dialog__header) {
    padding: 0;
}
</style>
