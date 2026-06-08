<template>
    <div class="dialog-container">
        <Transition name="fade" mode="out-in">
            <div v-if="!draftVisible" class="compose" key="compose">
                <div class="header">
                    <el-icon
                        @click.stop="closeDialog"
                        size="20px"
                        :color="hoverColor"
                        @mouseover="hoverColor = '#71b6ff'"
                        @mouseleave="hoverColor = '#000000'"
                        style="cursor: pointer"
                    >
                        <Close />
                    </el-icon>
                    <p v-if="teacher && teacher.teacherName" class="ask-teacher">
                        问 <span>{{ teacher.teacherName }}</span> 老师
                    </p>
                    <div class="header-right">
                        <el-button
                            @click.stop="openDraft"
                            type="primary"
                            round
                            text
                            class="draft-trigger"
                            >草稿</el-button
                        >
                        <el-button
                            v-if="deviceType.isMobile"
                            @click.stop="postQuestion"
                            type="primary"
                            round
                            class="post-btn-mobile"
                            color="#71b6ff"
                            style="color: white; margin-left: 8px"
                            >发布</el-button
                        >
                    </div>
                </div>
                <div class="main">
                    <div class="title" :class="{ 'is-focused': isTitleFocused }">
                        <UserAvatar
                            :src="avatarURL"
                            :name="userStore.getUser().nickname"
                            :size="40"
                        />
                        <el-input
                            v-model="questionContent.title"
                            placeholder="问题标题"
                            style="flex: 1"
                            :input-attrs="{ style: 'font-size: 16px; font-weight: 600;' }"
                            @focus="isTitleFocused = true"
                            @blur="isTitleFocused = false"
                        />
                    </div>
                    <div class="content" :class="{ 'is-focused': isContentFocused }">
                        <el-input
                            v-model="questionContent.content"
                            :autosize="{ minRows: 6, maxRows: 18 }"
                            type="textarea"
                            placeholder="问题内容"
                            @focus="isContentFocused = true"
                            @blur="isContentFocused = false"
                        />
                        <div class="image-container">
                            <div
                                class="picked-image"
                                v-for="(img, index) in questionContent.imageList"
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
                                <div class="delete-btn" @click.stop="deleteImage(index)">
                                    <SvgIcon
                                        icon="delete-round"
                                        color="#FF5F96"
                                        size="16px"
                                    ></SvgIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="line" />
                <div class="footer">
                    <div style="display: flex; align-items: center; gap: 10px">
                        <SvgIcon
                            @click.stop="pickImage"
                            icon="image"
                            size="24px"
                            color="#71b6ff"
                            style="cursor: pointer"
                        />
                    </div>
                    <input
                        type="file"
                        ref="imgPicker"
                        accept="image/png,image/jpeg,image/jpg"
                        style="display: none"
                        @change="pickImageImpl"
                        multiple
                    />
                    <el-button
                        v-if="!deviceType.isMobile"
                        @click="postQuestion"
                        type="primary"
                        round
                        color="#71b6ff"
                        style="color: white"
                        >发布</el-button
                    >
                </div>
            </div>
            <div v-else class="draft" key="draft">
                <div class="header">
                    <div class="left-item">
                        <el-icon
                            @click="draftVisible = false"
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
                <el-scrollbar>
                    <el-checkbox-group
                        v-model="deleteDrafts"
                        class="draft-items"
                        v-if="drafts.length != 0"
                    >
                        <div v-for="draft in drafts" :key="draft.id" class="border">
                            <div @click="useDraft(draft)" class="draft-item">
                                <div class="text-space">
                                    <p class="title">{{ draft.title }}</p>
                                    <p class="content">{{ draft.content }}</p>
                                </div>
                                <img-list
                                    class="img-list"
                                    v-if="draft.imgList.length != 0"
                                    :img-list="draft.imgList"
                                ></img-list>
                                <el-checkbox v-if="deleteMod" :value="draft.id" />
                            </div>
                        </div>
                    </el-checkbox-group>
                </el-scrollbar>
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
                <div v-if="drafts.length == 0" class="empty">
                    <p>暂无草稿</p>
                </div>
            </div>
        </Transition>
        <el-dialog
            v-model="innerVisible"
            width="300px"
            :show-close="false"
            align-center
            :modal="false"
            style="border-radius: 20px"
        >
            <template #header>
                <p style="margin: 0; font-size: 20px; padding: 0 20px">保存为草稿?</p>
            </template>
            <div class="inner-dialog">
                <p>你可以保存此内容，以便之后从草稿发布</p>
                <el-button @click="saveDraft" type="primary" round>保存</el-button>
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

<script setup lang="ts">
import { addQuestionApi, type AddQuestionReq, type QuestionItem } from '@/entities/question'
import { UserStore } from '@/app/store/modules/user'
import { DeviceTypeStore } from '@/shared/model/device-type.store'
import { GenId } from '@/shared/lib/gen-id'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElDialog } from 'element-plus/es/components/dialog/index.mjs'
import { ElImage } from 'element-plus/es/components/image/index.mjs'
import { ArrowLeft, Close } from '@element-plus/icons-vue'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/image/style/css'
import SvgIcon from '@/shared/ui/svg-icon'
import { UserAvatar } from '@/shared/ui/user-avatar'
import { inject, onBeforeUnmount, ref, type Ref } from 'vue'
import { loadDraftDb, type Question } from './draftDb'
import { ComposeDialogStore } from '@/features/question-compose/model'
import ImgList from './ImgList.vue'
import {
    createObjectUrlPreview,
    revokeObjectUrlPreview,
    revokeObjectUrlPreviews,
    type ObjectUrlPreview,
} from './objectUrlPreviews'

// pinia store
const userStore = UserStore()
const deviceType = DeviceTypeStore()
const composeDialogStore = ComposeDialogStore()

const isTitleFocused = ref(false)
const isContentFocused = ref(false)

// interface
export interface Ask {
    draftId?: number
    title: string
    content: string
    isPrivate: boolean
    fileList: File[]
    imageList: ObjectUrlPreview[]
}

export interface Answer {
    draftId?: number
    content: string
    fileList: File[]
    imageList: ObjectUrlPreview[]
}

// data
const avatarURL = userStore.getUser().avatar

// const visible = defineModel("visible", { default: false });

const draftVisible = ref(false)

const deleteDrafts = ref<number[]>([])

const deleteMod = ref(false)

const drafts = ref<Question[]>([])

const isSelectAll = ref(true)

const innerVisible = ref(false)

const questionContent = ref<Ask>({
    draftId: undefined,
    title: '',
    content: '',
    isPrivate: false,
    fileList: [],
    imageList: [],
})

// const props = defineProps<{
//     teacher?: Teacher;
// }>();

// const teacher = inject<{ teacherId: Ref<number>; teacherName: Ref<string> }>('teacher')
const teacher = inject<{ teacherId: Ref<number>; teacherName: Ref<string> } | undefined>(
    'teacher',
    undefined,
)

const hoverColor = ref('#000000')

const imgPicker = ref<HTMLInputElement>()

const pickImage = () => {
    if (imgPicker.value) {
        imgPicker.value.click()
    }
}

const emit = defineEmits(['questionPosted', 'closeDialog'])

// methods
function closeDialog() {
    if (draftVisible.value) {
        composeDialogStore.close()
        setTimeout(() => {
            draftVisible.value = false
            deleteMod.value = false
        }, 300)
        clearQuestionContent()
    } else if (
        questionContent.value.title == '' &&
        questionContent.value.content == '' &&
        questionContent.value.fileList.length == 0
    ) {
        composeDialogStore.close()
    } else {
        innerVisible.value = true
    }
}

defineExpose({
    closeDialog,
})

async function openDraft() {
    draftVisible.value = true
    await getDrafts()
}

function pickImageImpl(event: Event) {
    if (questionContent.value.fileList && questionContent.value.imageList) {
        const target = event.target as HTMLInputElement
        const files = target.files
        if (!files || questionContent.value.fileList.length + files.length > 8) {
            ElMessage.error('最多只能上传8张图片')
            return
        }
        questionContent.value.fileList.push(...files)
        for (let i = 0; i < files.length; i++) {
            questionContent.value.imageList.push(createObjectUrlPreview(files[i], GenId()))
        }
        if (imgPicker.value) imgPicker.value.value = ''
    }
}

function deleteImage(index: number) {
    revokeObjectUrlPreview(questionContent.value.imageList[index])
    questionContent.value.fileList.splice(index, 1)
    questionContent.value.imageList.splice(index, 1)
}

async function postQuestion() {
    if (questionContent.value.content == '') {
        ElMessage.error('问题内容不能为空')
        return
    } else if (questionContent.value.title == '') {
        ElMessage.error('问题标题不能为空')
        return
    }

    const formData = new FormData()
    const imgList = questionContent.value.imageList.map((img) => img.url)
    questionContent.value.fileList.forEach((file: File) => {
        formData.append('files', file)
    })

    const req: AddQuestionReq = {
        dst_user_id: teacher ? teacher.teacherId.value : null,
        title: questionContent.value.title,
        content: questionContent.value.content,
        is_private: questionContent.value.isPrivate,
    }

    formData.append('dst_user_id', req.dst_user_id?.toString() || '')
    formData.append('title', req.title)
    formData.append('content', req.content)
    formData.append('is_private', req.is_private.toString())

    await addQuestionApi(formData).then((res) => {
        if (res) {
            ElMessage.success('提问成功')
            // visible.value = false;
            composeDialogStore.close()
            if (questionContent.value.draftId) {
                void deleteDraft(questionContent.value.draftId)
            }
            const q: QuestionItem = {
                id: res.data.id,
                title: req.title,
                contents: req.content,
                views: 0,
                created_at: new Date().getTime(),
                image_urls: imgList,
                is_favorite: false,
                answer_num: 0,
                answer_avatars: [],
            }
            emit('questionPosted', q)
            clearQuestionContent({ revokeImages: false })
        } else {
            ElMessage.error('提问失败')
        }
    })
}

function clearQuestionContent(options: { revokeImages?: boolean } = {}) {
    if (options.revokeImages !== false) {
        revokeObjectUrlPreviews(questionContent.value.imageList)
    }
    questionContent.value.draftId = undefined
    questionContent.value.title = ''
    questionContent.value.content = ''
    questionContent.value.isPrivate = false
    questionContent.value.fileList = []
    questionContent.value.imageList = []
}

function handleDeleteMod() {
    if (deleteMod.value) {
        deleteDrafts.value = []
    }
    deleteMod.value = !deleteMod.value
}

function useDraft(draft: Question) {
    if (deleteMod.value) return
    revokeObjectUrlPreviews(questionContent.value.imageList)
    questionContent.value.title = draft.title
    questionContent.value.content = draft.content
    questionContent.value.fileList = []
    questionContent.value.imageList = []
    for (const img of draft.imgList) {
        questionContent.value.imageList.push(createObjectUrlPreview(img, GenId()))
        const file = img as File
        questionContent.value.fileList.push(new File([file], file.name, { type: file.type }))
    }
    questionContent.value.draftId = draft.id
    draftVisible.value = false
}

function handleCheckAllChange() {
    if (isSelectAll.value) {
        deleteDrafts.value = drafts.value.map((draft) => draft.id)
    } else {
        deleteDrafts.value = []
    }
    isSelectAll.value = !isSelectAll.value
}

async function addDraft() {
    const imgList: Blob[] = []
    for (const file of questionContent.value.fileList) {
        imgList.push(file)
    }
    try {
        const db = await loadDraftDb()
        await db.questions.add({
            title: questionContent.value.title,
            content: questionContent.value.content,
            imgList: imgList,
            time: new Date(),
        })
    } catch {
        ElMessage.error('保存草稿失败')
    }
}

async function getDrafts() {
    try {
        const db = await loadDraftDb()
        drafts.value = await db.questions.reverse().toArray()
    } catch {
        ElMessage.error('读取草稿失败')
    }
}

async function deleteDraft(id: number | number[]) {
    try {
        const db = await loadDraftDb()
        if (typeof id === 'number') {
            await db.questions.delete(id)
        } else {
            for (const draftId of id) {
                await db.questions.delete(draftId)
            }
        }
        await getDrafts()
    } catch {
        ElMessage.error('删除草稿失败')
    }
}

async function saveDraft() {
    await addDraft()
    innerVisible.value = false
    // visible.value = false;
    composeDialogStore.close()
    clearQuestionContent()
}

function cancelSaveDraft() {
    innerVisible.value = false
    // visible.value = false;
    composeDialogStore.close()
    clearQuestionContent()
}

onBeforeUnmount(() => {
    clearQuestionContent()
})
</script>

<style scoped lang="scss" src="./style/index.scss"></style>
