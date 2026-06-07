<template>
    <div class="dialog-container">
        <Transition name="fade" mode="out-in">
            <div v-if="!draftVisible" class="compose">
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
                    <el-button @click.stop="openDraft" type="primary" round text>草稿</el-button>
                </div>
                <div class="dialog">
                    <div v-if="quote?.in_replay_to != 0" class="quote-container">
                        <div class="quote">
                            <div class="avatar">
                                <UserAvatar :src="quote?.avatar" :name="quote?.author" :size="40" />
                            </div>
                            <div class="content">
                                <div class="author">{{ quote?.author }}</div>
                                <div class="text">{{ quote?.text }}</div>
                            </div>
                        </div>
                        <div class="middle">
                            <div class="line" />
                            <p>回复</p>
                        </div>
                    </div>
                    <div class="input-container">
                        <div class="avatar">
                            <UserAvatar
                                :src="userInfo.avatar"
                                :name="userInfo.nickname"
                                :size="40"
                            />
                        </div>
                        <div class="content">
                            <el-input
                                v-model="answerContent.content"
                                :autosize="{ minRows: 9, maxRows: 18 }"
                                type="textarea"
                                placeholder="发表新回复..."
                            />
                        </div>
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
                        <div class="delete-btn" @click.stop="deleteImage(index)">
                            <SvgIcon icon="delete-round" color="#FF5F96" size="16px"></SvgIcon>
                        </div>
                    </div>
                </transition-group>
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
                        @click="postAnswer"
                        type="primary"
                        round
                        color="#71b6ff"
                        style="color: white"
                        >发布</el-button
                    >
                </div>
            </div>
            <div v-else class="draft">
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
                <el-checkbox-group
                    v-model="deleteDrafts"
                    class="draft-items"
                    v-if="drafts.length != 0"
                >
                    <div v-for="draft in drafts" :key="draft.id" class="border">
                        <div @click="useDraft(draft)" class="draft-item">
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
import { UserStore } from '@/app/store/modules/user'
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
import { loadDraftDb, type Answer } from './draftDb'
import { ComposeDialogStore } from '@/app/store/modules/compose-dialog'
import ImgList from './ImgList.vue'
import { addAnswerApi, type AddAnswer, type AnswerItem, type Question } from '@/entities/answer'
import { hasTeacherAbility } from '@/shared/lib/auth'
import {
    createObjectUrlPreview,
    revokeObjectUrlPreview,
    revokeObjectUrlPreviews,
    type ObjectUrlPreview,
} from './objectUrlPreviews'

// pinia store
const userStore = UserStore()

const composeDialogStore = ComposeDialogStore()

// interface
export interface Quote {
    in_replay_to: number
    avatar: string
    author: string
    text: string
}

interface Ask {
    draftId?: number
    content: string
    fileList: File[]
    imageList: ObjectUrlPreview[]
}

// data

const userInfo = userStore.getUser()

// const visible = defineModel("visible", { default: false });

const draftVisible = ref(false)

const deleteDrafts = ref<number[]>([])

const deleteMod = ref(false)

const drafts = ref<Answer[]>([])

const isSelectAll = ref(true)

const innerVisible = ref(false)

const answerContent = ref<Ask>({
    draftId: undefined,
    content: '',
    fileList: [],
    imageList: [],
})

const question = inject<Ref<Question>>('question')!
const quote = inject<Ref<Quote>>('quote')

const hoverColor = ref('#000000')

const imgPicker = ref<HTMLInputElement>()

const pickImage = () => {
    if (imgPicker.value) {
        imgPicker.value.click()
    }
}

const emit = defineEmits(['answerPosted', 'closeDialog'])

// methods
function closeDialog() {
    if (draftVisible.value) {
        composeDialogStore.close()
        setTimeout(() => {
            draftVisible.value = false
            deleteMod.value = false
        }, 300)
        clearAnswerContent()
    } else if (answerContent.value.content == '' && answerContent.value.fileList.length == 0) {
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
    if (answerContent.value.fileList && answerContent.value.imageList) {
        const target = event.target as HTMLInputElement
        const files = target.files
        if (!files || answerContent.value.fileList.length + files.length > 8) {
            ElMessage.error('最多只能上传8张图片')
            return
        }
        answerContent.value.fileList.push(...files)
        for (let i = 0; i < files.length; i++) {
            answerContent.value.imageList.push(createObjectUrlPreview(files[i], GenId()))
        }
        if (imgPicker.value) imgPicker.value.value = ''
    }
}

function deleteImage(index: number) {
    revokeObjectUrlPreview(answerContent.value.imageList[index])
    answerContent.value.fileList.splice(index, 1)
    answerContent.value.imageList.splice(index, 1)
}

async function postAnswer() {
    const formData = new FormData()
    const imgList = answerContent.value.imageList.map((img) => img.url)
    answerContent.value.fileList.forEach((file: File) => {
        formData.append('files', file)
    })

    const req: AddAnswer = {
        question_id: question.value.id,
        in_reply_to: quote?.value.in_replay_to,
        content: answerContent.value.content,
    }

    formData.append('question_id', req.question_id.toString())
    if (req.in_reply_to) {
        formData.append('in_reply_to', req.in_reply_to.toString())
    }
    formData.append('content', req.content)

    await addAnswerApi(formData).then((res) => {
        if (res) {
            ElMessage.success('回复成功')
            composeDialogStore.close()
            if (answerContent.value.draftId) {
                void deleteDraft(answerContent.value.draftId)
            }
            const ans: AnswerItem = {
                id: res.data.id,
                user_id: userInfo.id ? userInfo.id : 1,
                user_avatar: userInfo.avatar ? userInfo.avatar : '@/assets/default-avatar.png',
                contents: req.content,
                created_at: new Date().getTime(),
                in_reply_to: req.in_reply_to ? req.in_reply_to : 0,
                upvotes: 0,
                image_urls: imgList,
                is_upvoted: false,
                teacher_name: hasTeacherAbility() ? userInfo.name : '',
                nickname: userInfo.nickname ? userInfo.nickname : '匿名用户',
            }
            emit('answerPosted', ans)
            clearAnswerContent({ revokeImages: false })
        } else {
            ElMessage.error('回复失败')
        }
    })
}

function clearAnswerContent(options: { revokeImages?: boolean } = {}) {
    if (options.revokeImages !== false) {
        revokeObjectUrlPreviews(answerContent.value.imageList)
    }
    answerContent.value.draftId = undefined
    answerContent.value.content = ''
    answerContent.value.fileList = []
    answerContent.value.imageList = []
}

function handleDeleteMod() {
    if (deleteMod.value) {
        deleteDrafts.value = []
    }
    deleteMod.value = !deleteMod.value
}

function useDraft(draft: Answer) {
    if (deleteMod.value) return
    revokeObjectUrlPreviews(answerContent.value.imageList)
    answerContent.value.content = draft.content
    answerContent.value.fileList = []
    answerContent.value.imageList = []
    for (const img of draft.imgList) {
        answerContent.value.imageList.push(createObjectUrlPreview(img, GenId()))
        const file = img as File
        answerContent.value.fileList.push(new File([file], file.name, { type: file.type }))
    }
    answerContent.value.draftId = draft.id
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
    for (const file of answerContent.value.fileList) {
        imgList.push(file)
    }
    try {
        const db = await loadDraftDb()
        await db.answers.add({
            time: new Date(),
            imgList: imgList,
            content: answerContent.value.content,
            question_id: question.value.id,
            in_reply_to: quote?.value.in_replay_to,
        })
    } catch {
        ElMessage.error('保存草稿失败')
    }
}

async function getDrafts() {
    try {
        const db = await loadDraftDb()
        drafts.value = await db.answers.reverse().toArray()
    } catch {
        ElMessage.error('读取草稿失败')
    }
}

async function deleteDraft(id: number | number[]) {
    try {
        const db = await loadDraftDb()
        if (typeof id === 'number') {
            await db.answers.delete(id)
        } else {
            for (const draftId of id) {
                await db.answers.delete(draftId)
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
    clearAnswerContent()
}

function cancelSaveDraft() {
    innerVisible.value = false
    // visible.value = false;
    composeDialogStore.close()
    clearAnswerContent()
}

onBeforeUnmount(() => {
    clearAnswerContent()
})
</script>

<style scoped lang="scss" src="./style/index.scss"></style>
