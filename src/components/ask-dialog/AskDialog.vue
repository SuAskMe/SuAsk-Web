<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import "md-editor-v3/lib/style.css";
import SvgIcon from "@/components/svg-icon";
import { ElMessage, ElMessageBox, type UploadInstance } from "element-plus";
import { GenId } from "@/views/home/content/question-detail/QuestionDetail";
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
        }, 300);
    } else if (title.value == "" && contents.value == "" && fileList.value.length == 0) {
        done();
    }
    else {
        innerVisible.value = true;
    }
}

function saveDraft() {
    addDraft();
    innerVisible.value = false;
    visible.value = false;
}

function cancelSaveDraft() {
    innerVisible.value = false;
    visible.value = false;
}

defineProps<{
    fullscreen?: boolean;
    teacherName?: string;
    avatarURL?: string;
}>();

const title = ref("");
const contents = ref("");
const isPublic = ref(false);

const avatarURL = getUserInfo().avatar;

const hoverColor = ref('#000000');

const imgPicker = ref<HTMLInputElement>();
const pickImage = () => {
    if (imgPicker.value) {
        imgPicker.value.click();
    }
};
interface Img {
    id: number;
    url: string;
}
const fileList = ref<File[]>([]);
const imageList = ref<Img[]>([]);

const pickImageImpl = (event: any) => {
    if (fileList.value && imageList.value) {
        const files = event.target.files;
        if (fileList.value.length + files.length > 8) {
            ElMessage.error("最多只能上传8张图片");
            return;
        }
        fileList.value.push(...files);
        for (let i = 0; i < files.length; i++) {
            imageList.value.push({
                id: GenId(),
                url: URL.createObjectURL(files[i]),
            });
        }
        if (imgPicker.value) imgPicker.value.value = "";
        console.log(fileList.value, imageList.value);
    }
};

const deleteImage = (index: number) => {
    fileList.value.splice(index, 1);
    imageList.value.splice(index, 1);
};

// 草稿
import { db, type Question } from "./db";
import { fi } from "element-plus/es/locales.mjs";

const deleteDrafts = ref<any>([]);
const deleteMod = ref(false);

function handleDeleteMod() {
    if (deleteMod.value) {
        deleteDrafts.value = [];
    }
    deleteMod.value = !deleteMod.value;
}

const drafts = ref<Question[]>([]);
const isSelectAll = ref(true);

function handleCheckAllChange() {
    if (isSelectAll.value) {
        deleteDrafts.value = drafts.value.map(draft => draft.id);
    } else {
        deleteDrafts.value = [];
    }
    isSelectAll.value = !isSelectAll.value;
    console.log(deleteDrafts.value);

}

function useDraft(draft: Question) {
    title.value = draft.title;
    contents.value = draft.content;
    for (const img of draft.imgList) {
        imageList.value.push({
            id: GenId(),
            url: URL.createObjectURL(img),
        });
        const file = img as File;
        fileList.value.push(new File([file], file.name, { type: file.type }));
    }
    isDraft.value = false;
}

async function addDraft() {
    let imgList: Blob[] = [];
    for (const file of fileList.value) {
        imgList.push(file);
    }
    try {
        const id = await db.questions.add({
            title: title.value,
            content: contents.value,
            imgList: imgList,
            time: new Date(),
        });
        console.log("Draft added with id", id);
    } catch (error) {
        console.error("Error adding draft", error);
    }
}

async function getDrafts() {
    try {
        drafts.value = await db.questions.reverse().toArray();
        console.log("Drafts got", drafts.value);
    } catch (error) {
        console.error("Error getting drafts", error);
    }
}

async function deleteDraft() {
    try {
        for (const id of deleteDrafts.value) {
            await db.questions.delete(id);
            console.log("Draft deleted with id", id);
        }
        await getDrafts();
    } catch (error) {
        console.error("Error deleting drafts", error);
    }
}

</script>

<template>
    <div class="dialog">
        <el-dialog v-model="visible" :fullscreen="fullscreen" width="40%" :show-close="false"
            :before-close="handleClose">
            <!-- 正文 -->
            <template v-if="!isDraft" #header="{ close }">
                <div class="header">
                    <el-icon @click="close" size="20px" :color="hoverColor" @mouseover="hoverColor = '#71b6ff'"
                        @mouseleave="hoverColor = '#000000'">
                        <Close />
                    </el-icon>
                    <el-button @click="openDraft" type="primary" round>草稿</el-button>
                </div>
            </template>
            <div v-if="!isDraft">
                <div class="title">
                    <el-avatar :src="avatarURL" :size="40" />
                    <el-input v-model="title" placeholder="问题标题" style="width: 87%;"
                        :input-attrs="{ style: 'font-size: 16px;' }" />
                </div>
                <div class="content">
                    <el-input v-model="contents" :autosize="{ minRows: 6, maxRows: 8 }" type="textarea"
                        placeholder="问题内容" />
                </div>
                <transition-group class="image-container" tag="div" name="fade-list" move-class="fade-list-move">
                    <div class="picked-image" v-for="(img, index) in imageList" :key="img.id" :id="'image-' + img.id">
                        <el-image @click.stop :src="img.url" :preview-src-list="[img.url]" class="image" fit="cover"
                            preview-teleported></el-image>
                        <div class="delete-btn" @click.stop="deleteImage(index)">
                            <SvgIcon icon="delete-round" color="#FF5F96" size="16px"></SvgIcon>
                        </div>
                    </div>
                </transition-group>
                <hr class="line" />
                <div class="footer">
                    <SvgIcon @click.stop="pickImage" icon="image" size="24px" color="#71b6ff" style="cursor: pointer" />
                    <input type="file" ref="imgPicker" accept="image/png,image/jpeg,image/jpg" style="display: none"
                        @change="pickImageImpl" multiple />
                    <el-button type="primary" round>发布</el-button>
                </div>
            </div>
            <!-- 草稿 -->
            <template v-if="isDraft" #header>
                <div class="header">
                    <div style="display: flex; align-items: center; font-weight: bold; font-size: 20px;">
                        <el-icon @click="isDraft = false" size="20px" :color="hoverColor"
                            @mouseover="hoverColor = '#71b6ff'" @mouseleave="hoverColor = '#000000'">
                            <ArrowLeft />
                        </el-icon>
                        <p>草稿</p>
                    </div>
                    <el-button v-if="!deleteMod" @click="handleDeleteMod" type="primary" round>编辑</el-button>
                    <el-button v-if="deleteMod" @click="handleDeleteMod" type="primary" round>完成</el-button>
                </div>
            </template>
            <div v-if="isDraft">
                <el-checkbox-group v-model="deleteDrafts" class="draft" v-if="drafts.length != 0">
                    <div @click="useDraft(draft)" v-for="draft in drafts" :key="draft.id" class="draft-card">
                        <div style="display: flex; flex-direction: column;">
                            <p class="title">{{ draft.title }}</p>
                            <p class="content">{{ draft.content }}</p>
                        </div>
                        <img-list v-if="draft.imgList.length != 0" :img-list="draft.imgList"></img-list>
                        <el-checkbox v-if="deleteMod" :value="draft.id" />
                    </div>
                </el-checkbox-group>
                <div v-if="deleteMod" class="footer">
                    <el-button @click="handleCheckAllChange" type="primary" size="small" round>全选</el-button>
                    <el-button @click="deleteDraft" type="danger" size="small" round>删除</el-button>
                </div>
                <div v-if="drafts.length == 0">
                    <p>暂无草稿</p>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-model="innerVisible" width="300px" :show-close="false" align-center>
            <template #header style="padding: 0;">
                <p style="margin: 0; font-size: 20px; padding: 0 20px;">保存为草稿?</p>
            </template>
            <div class="inner-dialog">
                <p>你可以保存此内容，以便之后从草稿发布</p>
                <el-button @click="saveDraft" type="primary" round>保存</el-button>
                <el-button @click="cancelSaveDraft" style="margin: 0; margin-top: 10px;" type="default"
                    round>取消</el-button>
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

    .title {
        display: flex;
        width: 100%;

        .el-avatar {
            margin-right: 10px;
        }
    }

    .content {
        margin-top: 10px;
        width: 100%;

        :deep(.el-textarea__inner) {
            resize: none !important;
        }

        .el-textarea {
            --el-input-focus-border-color: white !important;
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
        line-height: 20px;

        .draft-card {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            padding: 10px;
            border-top: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;

            .title {
                height: 16px;
                font-size: 16px;
                font-weight: bold;
            }

            .content {
                padding-top: 5px;
                height: 14px;
                font-size: 14px;
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
