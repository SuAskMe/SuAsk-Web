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
                                <el-avatar :src="quote?.avatar" :size="40">
                                    <img src="@/assets/default-avatar.png" />
                                </el-avatar>
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
                            <el-avatar :src="userInfo.avatar" :size="40">
                                <img src="@/assets/default-avatar.png" />
                            </el-avatar>
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
import { UserStore } from '@/store/modules/user'
import { GenId } from '@/views/question-detail/QuestionDetail'
import { ElMessage } from 'element-plus'
import SvgIcon from '@/components/svg-icon'
import { inject, ref, type Ref } from 'vue'
import { db, type Answer } from './db'
import { ComposeDialogStore } from '@/store/modules/compose-dialog'
import ImgList from './ImgList.vue'
import type { AddAnswer, AnswerItem, Question } from '@/model/answer.model'
import { addAnswerApi } from '@/api/answer/answer.api'

// pinia store
const userStore = UserStore()

const composeDialogStore = ComposeDialogStore()

// interface
interface Img {
    id: number
    url: string
}

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
    imageList: Img[]
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

function openDraft() {
    draftVisible.value = true
    getDrafts()
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
            answerContent.value.imageList.push({
                id: GenId(),
                url: URL.createObjectURL(files[i]),
            })
        }
        if (imgPicker.value) imgPicker.value.value = ''
    }
}

function deleteImage(index: number) {
    answerContent.value.fileList.splice(index, 1)
    answerContent.value.imageList.splice(index, 1)
}

async function postAnswer() {
    // let userId = getUserInfo().id ? getUserInfo().id : null;
    // console.log(answerContent.value.fileList);

    const formData = new FormData()
    const imgList: string[] = []
    answerContent.value.fileList.forEach((file: File) => {
        formData.append('files', file)
        imgList.push(URL.createObjectURL(file))
    })

    console.log('question', question)

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
                deleteDraft(answerContent.value.draftId)
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
                teacher_name: userInfo.role == 'teacher' ? userInfo.name : '',
                nickname: userInfo.nickname ? userInfo.nickname : '匿名用户',
            }
            emit('answerPosted', ans)
            clearAnswerContent()
        } else {
            ElMessage.error('回复失败')
        }
    })
}

function clearAnswerContent() {
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
    // unchanged
    if (deleteMod.value) return
    answerContent.value.content = draft.content
    answerContent.value.fileList = []
    answerContent.value.imageList = []
    for (const img of draft.imgList) {
        answerContent.value.imageList.push({
            id: GenId(),
            url: URL.createObjectURL(img),
        })
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
    // console.log(deleteDrafts.value);
}

async function addDraft() {
    const imgList: Blob[] = []
    for (const file of answerContent.value.fileList) {
        imgList.push(file)
    }
    try {
        const id = await db.answers.add({
            time: new Date(),
            imgList: imgList,
            content: answerContent.value.content,
            question_id: question.value.id,
            in_reply_to: quote?.value.in_replay_to,
        })
        console.log('Draft added with id', id)
    } catch (error) {
        console.error('Error adding draft', error)
    }
}

async function getDrafts() {
    try {
        drafts.value = await db.answers.reverse().toArray()
        console.log('Drafts got', drafts.value)
    } catch (error) {
        console.error('Error getting drafts', error)
    }
}

async function deleteDraft(id: number | number[]) {
    try {
        if (typeof id === 'number') {
            await db.answers.delete(id)
            console.log('Draft deleted with id', id)
        } else {
            for (const draftId of id) {
                await db.answers.delete(draftId)
                console.log('Draft deleted with id', draftId)
            }
        }
        await getDrafts()
    } catch (error) {
        console.error('Error deleting drafts', error)
    }
}

function saveDraft() {
    addDraft()
    innerVisible.value = false
    // visible.value = false;
    composeDialogStore.close()
}

function cancelSaveDraft() {
    innerVisible.value = false
    // visible.value = false;
    composeDialogStore.close()
    clearAnswerContent()
}
</script>

<style scoped lang="scss" src="./style/index.scss"></style>
