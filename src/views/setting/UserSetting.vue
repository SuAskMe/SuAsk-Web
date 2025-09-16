<template>
    <el-container class="container">
        <el-header class="header">
            <QuestionHeader sidebar_btn @sidebar="sidebar" />
        </el-header>
        <el-scrollbar>
            <el-alert
                v-if="showSaveReminder"
                class="save-reminder"
                title="您有未保存的更改"
                type="warning"
                show-icon
                closable
                @close="showSaveReminder = false"
            >
                <template #default>
                    <div class="alert-content">
                        <span>您已修改了设置，请记得保存更改</span>
                        <el-button
                            @click="updateUserInfo"
                            type="primary"
                            size="small"
                            class="alert-save-btn"
                        >
                            保存更改
                        </el-button>
                    </div>
                </template>
            </el-alert>
            <el-main class="main-container">
                <el-dialog
                    v-model="cropVisible"
                    title="裁剪头像"
                    center
                    align-center
                    :style="{
                        height: deviceTypeStore.isMobile ? '100vh' : '90vh',
                        width: '100vw',
                        maxWidth: '768px',
                    }"
                    class="crop-dialog"
                >
                    <div
                        ref="cropperContainer"
                        class="cropper-container"
                        :style="{
                            height: deviceTypeStore.isMobile ? '80vh' : '70vh',
                            width: '92vw',
                            maxWidth: '720px',
                        }"
                    >
                        <div
                            :style="{ width: imgSize.width + 'px', height: imgSize.height + 'px' }"
                        >
                            <vue-cropper
                                ref="cropper"
                                :img="cropImg"
                                :auto-crop="true"
                                :fixed="true"
                                :fixed-number="[1, 1]"
                                :center-box="true"
                                outputType="png"
                            />
                        </div>
                    </div>
                    <template #footer>
                        <el-button @click="cropVisible = false" style="margin-right: 15vw"
                            >取消</el-button
                        >
                        <el-button type="primary" @click="confirmCrop">确认</el-button>
                    </template>
                </el-dialog>

                <div class="setting-card">
                    <div class="title">
                        <h2>基础信息</h2>
                    </div>
                    <div class="name-bio-avatar">
                        <div class="name-bio">
                            <div class="field-group">
                                <label>昵称</label>
                                <el-input v-model="basicInfo.nickname" placeholder="请输入昵称" />
                            </div>
                            <div class="field-group">
                                <label>简介</label>
                                <bio-panel v-model="basicInfo.introduction" />
                            </div>
                        </div>
                        <div class="avatar-id">
                            <div class="avatar-container">
                                <div class="avatar">
                                    <el-avatar :size="150" :src="usingAvatar">
                                        <img src="@/assets/default-avatar.png" />
                                    </el-avatar>
                                    <input
                                        type="file"
                                        ref="imgPicker"
                                        accept="image/png,image/jpeg,image/jpg"
                                        style="display: none"
                                        @change="pickImageImpl"
                                    />
                                    <el-button
                                        @click.stop="pickImage"
                                        class="upload-btn"
                                        type="primary"
                                        size="small"
                                    >
                                        <template #icon>
                                            <svg-icon icon="edit" color="#ffffff" />
                                        </template>
                                        编辑
                                    </el-button>
                                </div>
                                <p class="id">@{{ basicInfo.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="setting-card">
                    <div class="title">
                        <h2>主题</h2>
                    </div>
                    <div class="theme-picker">
                        <div class="theme">
                            <theme-image
                                v-model="basicInfo.themeId"
                                :src="imgList"
                                :width="deviceTypeStore.isMobile ? '75px' : '100px'"
                            />
                        </div>
                    </div>
                </div>

                <div class="setting-card">
                    <div class="title">
                        <h2>通知设置</h2>
                    </div>
                    <div class="notification-settings">
                        <div class="field-group">
                            <label>启用邮件通知</label>
                            <el-switch
                                v-model="notificationSettings.notifySwitch"
                                active-text="开启"
                                inactive-text="关闭"
                            />
                        </div>
                        <div class="field-group">
                            <label>通知邮箱</label>
                            <el-input
                                v-model="notificationSettings.notifyEmail"
                                placeholder="请输入接收通知的邮箱地址"
                                :disabled="!notificationSettings.notifySwitch"
                            />
                        </div>
                    </div>
                </div>

                <div class="button-container">
                    <el-button
                        @click="updateUserInfo"
                        type="primary"
                        size="large"
                        class="save-button"
                    >
                        保存更改
                    </el-button>
                </div>

                <div v-if="userStore.getRole() == 'teacher'" class="setting-card">
                    <div class="title">
                        <h2>提问箱可见性</h2>
                    </div>
                    <div class="visibility-selector">
                        <div
                            class="visibility-card"
                            :class="{ active: questionVisible === 'public' }"
                            @click="questionVisible = 'public'"
                        >
                            <div class="card-content">
                                <div class="icon-container">
                                    <i class="el-icon-view"></i>
                                </div>
                                <h3 class="option-title">公开</h3>
                                <p class="option-desc">任何人都可以访问提问箱</p>
                            </div>
                        </div>

                        <div
                            class="visibility-card"
                            :class="{ active: questionVisible === 'protected' }"
                            @click="questionVisible = 'protected'"
                        >
                            <div class="card-content">
                                <div class="icon-container">
                                    <i class="el-icon-lock"></i>
                                </div>
                                <h3 class="option-title">需登录</h3>
                                <p class="option-desc">仅登录用户可以访问提问箱</p>
                            </div>
                        </div>

                        <div
                            class="visibility-card"
                            :class="{ active: questionVisible === 'private' }"
                            @click="questionVisible = 'private'"
                        >
                            <div class="card-content">
                                <div class="icon-container">
                                    <i class="el-icon-turn-off"></i>
                                </div>
                                <h3 class="option-title">关闭</h3>
                                <p class="option-desc">暂时关闭提问箱，无法访问</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="setting-card danger-zone">
                    <div class="title">
                        <h2>账号设置</h2>
                    </div>
                    <div class="password-logout">
                        <p class="danger-option" @click="resetPassword">
                            <i class="el-icon-lock"></i> 重置密码
                        </p>
                        <p class="danger-option" @click="showLogoutDialog">
                            <i class="el-icon-switch-button"></i> 退出登录
                        </p>
                    </div>
                </div>
                <div style="height: 50px"></div>
            </el-main>
        </el-scrollbar>
        <reset-password-dialog v-model:visible="showResetPassword" />
        <logout-dialog v-model:visible="showLogout" />
    </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { getUserInfoApi, updateUserInfoApi } from '@/api/user/user.api'
import { UserStore } from '@/store/modules/user'
import { updateTeacherPermApi } from '@/api/teacher/teacher.api'
import QuestionHeader from '@/components/question-header'
import { SidebarStore } from '@/store/modules/sidebar'
import BioPanel from '@/components/bio-panel/BioPanel.vue'
import { DeviceTypeStore } from '@/store/modules/device-type'
import ThemeImage from './ThemeImage.vue'
import ResetPasswordDialog from './ResetPasswordDialog.vue'
import LogoutDialog from './LogoutDialog.vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { compressionBlob } from '@/utils/imgCompress'

const imgList = ref<string[]>([])
const images = import.meta.glob('@/assets/bg_imgs/*.jpg', { eager: true })
imgList.value = Object.values(images).map((module) => (module as { default: string }).default)

const deviceTypeStore = DeviceTypeStore()

const sidebarStore = SidebarStore()

function sidebar() {
    sidebarStore.toggle()
}

const imgPicker = ref<HTMLInputElement>()

function pickImage() {
    if (imgPicker.value) {
        imgPicker.value.click()
    }
}

const avatarFile = ref<File | null>(null)
const cropVisible = ref(false)
const cropImg = ref('')
const imgSize = ref({ width: 0, height: 0 })
const cropper = ref<typeof VueCropper | null>(null)
const avatarFileType = ref('')
const cropperContainer = ref<HTMLDivElement | null>(null)

async function pickImageImpl(event: Event) {
    if (event == null) return
    const target = event.target as HTMLInputElement
    const files = target.files
    if (files == null || files.length > 1) {
        ElMessage.error('只能上传一张头像')
        return
    }
    const file: File = files[0]
    target.value = ''
    // 限制文件类型
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        ElMessage.error('仅支持 JPG/PNG 格式')
        return
    }
    avatarFileType.value = file.type
    cropImg.value = URL.createObjectURL(file)
    const img = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = cropImg.value
    })
    let w = img.width
    let h = img.height
    cropVisible.value = true
    nextTick(() => {
        const maxH = cropperContainer.value!.offsetHeight
        const maxW = cropperContainer.value!.offsetWidth
        if (w > maxW || h > maxH) {
            const scale = Math.min(maxW / w, maxH / h)
            w = w * scale
            h = h * scale
        }
        imgSize.value = { width: w, height: h }
    })
}

// 新增裁剪确认处理
const confirmCrop = async () => {
    if (cropper.value == null) return
    cropper.value.getCropBlob(async (blob: Blob) => {
        const imgLoading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        // 更新预览和上传文件
        const resizedBlob = await compressionBlob(blob, avatarFileType.value, 0.5, 400, 400)
        let name = ''
        if (avatarFileType.value === 'image/jpeg') {
            name = 'avatar.jpg'
        } else if (avatarFileType.value === 'image/png') {
            name = 'avatar.png'
        }
        avatarFile.value = new File([resizedBlob], name, {
            type: avatarFileType.value,
        })
        usingAvatar.value = URL.createObjectURL(avatarFile.value)
        cropVisible.value = false
        imgLoading.close()

        // 头像更改后检查是否需要显示提醒
        checkForUnsavedChanges()
    })
}

const userStore = UserStore()

const showSaveReminder = ref(false)
let hasUnsavedChanges = false
const usingAvatar = ref<string>('') // 用于追踪正在使用的头像

const basicInfo = computed(() => userStore.getUser())

// 创建一个用于追踪原始值的引用
const originalValues = ref({
    nickname: '',
    introduction: '',
    themeId: 0,
    notifySwitch: false,
    notifyEmail: '',
    question_box_perm: '',
    avatar: '',
})

// 初始化原始值
onMounted(() => {
    const user = userStore.getUser()
    originalValues.value = {
        nickname: user.nickname,
        introduction: user.introduction,
        themeId: user.themeId,
        notifySwitch: user.notifySwitch,
        notifyEmail: user.notifyEmail,
        question_box_perm: user.question_box_perm,
        avatar: user.avatar ? user.avatar : '',
    }
    usingAvatar.value = user.avatar ? user.avatar : ''
})

// 检查是否有未保存的更改
function checkForUnsavedChanges() {
    const hasChanges =
        basicInfo.value.nickname !== originalValues.value.nickname ||
        basicInfo.value.introduction !== originalValues.value.introduction ||
        basicInfo.value.themeId !== originalValues.value.themeId ||
        notificationSettings.value.notifySwitch !== originalValues.value.notifySwitch ||
        notificationSettings.value.notifyEmail !== originalValues.value.notifyEmail ||
        (userStore.getRole() === 'teacher' &&
            questionVisible.value !== originalValues.value.question_box_perm) ||
        usingAvatar.value !== originalValues.value.avatar // 添加头像更改检测

    if (hasChanges && !hasUnsavedChanges) {
        showSaveReminder.value = true
        hasUnsavedChanges = true
    } else if (!hasChanges && hasUnsavedChanges) {
        showSaveReminder.value = false
        hasUnsavedChanges = false
    }
}

// 监听基础信息变化
watch(
    () => basicInfo.value,
    () => {
        if (originalValues.value.nickname) {
            // 确保已经初始化
            checkForUnsavedChanges()
        }
    },
    { deep: true },
)

const notificationSettings = ref({
    notifySwitch: userStore.getUser().notifySwitch || false,
    notifyEmail: userStore.getUser().notifyEmail || '',
})

// 监听通知设置变化
watch(
    () => notificationSettings.value,
    () => {
        if (originalValues.value.nickname) {
            // 确保已经初始化
            checkForUnsavedChanges()
        }
    },
    { deep: true },
)

async function updateUserInfo() {
    const formData = new FormData()
    formData.append('nickname', basicInfo.value.nickname)
    formData.append('introduction', basicInfo.value.introduction)
    formData.append('themeId', basicInfo.value.themeId.toString())
    formData.append('avatar', avatarFile.value!)
    formData.append('notifySwitch', notificationSettings.value.notifySwitch.toString())
    if (notificationSettings.value.notifyEmail) {
        formData.append('notifyEmail', notificationSettings.value.notifyEmail)
    }

    await updateUserInfoApi(formData)
        .then(async (res) => {
            if (res) {
                ElMessage.success('保存成功')
                // 保存成功后更新原始值
                originalValues.value.nickname = basicInfo.value.nickname
                originalValues.value.introduction = basicInfo.value.introduction
                originalValues.value.themeId = basicInfo.value.themeId
                originalValues.value.notifySwitch = notificationSettings.value.notifySwitch
                originalValues.value.notifyEmail = notificationSettings.value.notifyEmail
                basicInfo.value.avatar = usingAvatar.value
                if (userStore.getRole() === 'teacher') {
                    originalValues.value.question_box_perm = questionVisible.value
                }
                originalValues.value.avatar = usingAvatar.value // 更新原始头像值
                showSaveReminder.value = false
                hasUnsavedChanges = false

                await getUserInfoApi().then((res) => {
                    if (res) {
                        userStore.setUser(res)
                        // 更新通知设置
                        notificationSettings.value.notifySwitch = res.notifySwitch
                        notificationSettings.value.notifyEmail = res.notifyEmail
                    } else {
                        ElMessage.error('保存失败1')
                    }
                })
            } else {
                ElMessage.error('保存失败2')
            }
        })
        .catch((err) => {
            console.log(err)
            ElMessage.error('保存失败3')
            return
        })
}

const showResetPassword = ref(false)

function resetPassword() {
    showResetPassword.value = true
}

const showLogout = ref(false)

function showLogoutDialog() {
    showLogout.value = true
}

const questionVisible = ref(userStore.getUser().question_box_perm)

// 监听教师可见性设置变化
if (userStore.getRole() == 'teacher') {
    watch(
        () => questionVisible.value,
        () => {
            if (originalValues.value.nickname) {
                // 确保已经初始化
                checkForUnsavedChanges()
            }
        },
    )
}

if (userStore.getRole() == 'teacher') {
    watch(
        () => questionVisible.value,
        async () => {
            // 更新原始值以防止重复提醒
            originalValues.value.question_box_perm = questionVisible.value

            await updateTeacherPermApi(questionVisible.value).then(async (res) => {
                if (res) {
                    ElMessage.success('保存成功')
                    const user = userStore.getUser()
                    user.question_box_perm = questionVisible.value
                    userStore.setUser(user)
                } else {
                    ElMessage.error('保存失败')
                }
            })
        },
    )
}
</script>

<style lang="scss" scoped src="./setting.scss"></style>

<style lang="scss" scoped>
.save-reminder {
    position: absolute;
    top: 0;
    z-index: 1000;
    margin: 2em;
    margin-top: 0.5em;
    width: calc(100% - 4em);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    :deep(.el-alert__content) {
        width: 100%;
    }

    .alert-content {
        display: flex;
        align-items: center;
        width: 100%;

        .alert-save-btn {
            margin-left: 15px;
            border-radius: 6px;
        }
    }

    @media (max-width: 768px) {
        .alert-content {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;

            .alert-save-btn {
                margin-left: 0;
            }
        }
    }
}

:deep(.el-dialog) {
    border-radius: 15px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}

:deep(.el-input__wrapper) {
    border-radius: 10px;
    transition: all 0.3s;

    &:hover,
    &:focus {
        box-shadow: 0 0 0 1px $su-blue inset;
    }
}

:deep(.el-radio-button__inner) {
    transition: all 0.3s ease;
}

:deep(.el-switch) {
    height: 24px;
    --el-switch-on-color: #409eff;
    --el-switch-off-color: #dcdfe6;
    --el-switch-core-border-radius: 12px;

    .el-switch__core {
        width: 48px !important;
        height: 24px;
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 0 4px rgba(64, 158, 255, 0.5);
        }

        .el-switch__action {
            width: 20px;
            height: 20px;
        }
    }

    &.is-checked .el-switch__core .el-switch__action {
        left: calc(100% - 22px);
    }
}

.notification-settings .field-group:last-child {
    :deep(.el-input) {
        .el-input__wrapper {
            max-width: 500px;
            border-radius: 12px;
            box-shadow: 0 0 0 1px #dcdfe6 inset;
            transition: all 0.3s ease;

            &.is-focus {
                box-shadow: 0 0 0 2px #409eff inset;
            }

            &:hover {
                box-shadow: 0 0 0 1px #a8abb2 inset;
            }

            .el-input__inner {
                &::placeholder {
                    color: #a8abb2;
                }
            }
        }

        &.is-disabled {
            .el-input__wrapper {
                background-color: #f5f7fa;
                box-shadow: 0 0 0 1px #e4e7ed inset;
            }
        }
    }
}
</style>
