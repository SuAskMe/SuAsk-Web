<template>
    <div class="setting-page-container">
        <header class="header">
            <QuestionHeader sidebar_btn @sidebar="sidebar" />
        </header>
        <div class="setting-scroll-area">
            <main v-if="isGuest" class="main-container">
                <GuestUpgradeNotice />
            </main>

            <template v-else>
                <!-- 自定义保存悬浮提示条 -->
                <transition name="toast-slide">
                    <div v-if="showSaveReminder" class="save-reminder-toast">
                        <div class="toast-content">
                            <span class="toast-text">您已修改了设置，请记得保存更改</span>
                            <button @click="updateUserInfo" class="toast-save-btn">保存更改</button>
                        </div>
                    </div>
                </transition>

                <main class="main-container">
                    <div class="settings-hero">
                        <h1 class="hero-title">设置</h1>
                        <p class="hero-desc">
                            在这里管理您的账户基础信息、提问箱可见性、邮件通知偏好及账户安全设置
                        </p>
                    </div>

                    <el-dialog
                        v-model="cropVisible"
                        title="裁剪头像"
                        center
                        align-center
                        @closed="clearCropImage"
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
                                :style="{
                                    width: imgSize.width + 'px',
                                    height: imgSize.height + 'px',
                                }"
                            >
                                <AvatarCropper v-if="cropVisible" ref="cropper" :img="cropImg" />
                            </div>
                        </div>
                        <template #footer>
                            <el-button @click="cropVisible = false" style="margin-right: 15vw"
                                >取消</el-button
                            >
                            <el-button type="primary" @click="confirmCrop">确认</el-button>
                        </template>
                    </el-dialog>

                    <ProfileSection
                        :is-guest="isGuest"
                        :basic-info="basicInfo"
                        :avatar-url="usingAvatar"
                        icon="setting-user"
                        @pick-image="pickImageImpl"
                        @update:nickname="basicInfo.nickname = $event"
                        @update:introduction="basicInfo.introduction = $event"
                    />

                    <ThemeSection
                        :theme-id="basicInfo.themeId"
                        icon="setting-brush"
                        @update:theme-id="basicInfo.themeId = $event"
                    />

                    <NotificationSection
                        :settings="notificationSettings"
                        icon="setting-bell"
                        @update:notify-switch="notificationSettings.notifySwitch = $event"
                        @update:notify-email="notificationSettings.notifyEmail = $event"
                    />

                    <div v-if="!isGuest" class="button-container">
                        <button @click="updateUserInfo" class="save-button-custom">保存更改</button>
                    </div>

                    <VisibilitySection
                        v-if="isTeacher()"
                        v-model="questionVisible"
                        icon="setting-eye"
                    />

                    <AccountActionsSection
                        v-if="!isGuest"
                        icon="setting-lock"
                        @reset-password="resetPassword"
                        @logout="showLogoutDialog"
                        @deactivate="showDeactivateDialog"
                    />
                    <div style="height: 50px"></div>
                </main>
            </template>
        </div>
        <reset-password-dialog v-model:visible="showResetPassword" />
        <logout-dialog v-model:visible="showLogout" />
        <deactivate-dialog v-model:visible="showDeactivate" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, defineAsyncComponent, onUnmounted } from 'vue'
import { ElLoading } from 'element-plus/es/components/loading/index.mjs'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElDialog } from 'element-plus/es/components/dialog/index.mjs'
import 'element-plus/es/components/dialog/style/css'
import { getUserInfoApi, updateUserInfoApi } from '@/entities/user'
import { UserStore } from '@/store/modules/user'
import { updateTeacherPermApi } from '@/entities/teacher'
import QuestionHeader from '@/widgets/question-header'
import { SidebarStore } from '@/store/modules/sidebar'
import { DeviceTypeStore } from '@/store/modules/device-type'
import ResetPasswordDialog from './ResetPasswordDialog.vue'
import LogoutDialog from './LogoutDialog.vue'
import DeactivateDialog from './DeactivateDialog.vue'
import { compressionBlob } from '@/shared/lib/image-compression'
import { isTeacher } from '@/shared/lib/auth'
import GuestUpgradeNotice from './sections/GuestUpgradeNotice.vue'
import ProfileSection from './sections/ProfileSection.vue'
import ThemeSection from './sections/ThemeSection.vue'
import NotificationSection from './sections/NotificationSection.vue'
import VisibilitySection from './sections/VisibilitySection.vue'
import AccountActionsSection from './sections/AccountActionsSection.vue'

const isGuest = computed(() => userStore.getRole() === 'guest')

const AvatarCropper = defineAsyncComponent(() => import('./AvatarCropper.vue'))

const deviceTypeStore = DeviceTypeStore()

const sidebarStore = SidebarStore()

function sidebar() {
    sidebarStore.toggle()
}

const avatarFile = ref<File | null>(null)
const cropVisible = ref(false)
const cropImg = ref('')
const imgSize = ref({ width: 0, height: 0 })
const cropper = ref<{
    getCropBlob: (callback: (blob: Blob) => void) => void
} | null>(null)
const avatarFileType = ref('')
const cropperContainer = ref<HTMLDivElement | null>(null)
const cropObjectUrl = ref('')
const avatarPreviewObjectUrl = ref('')

function revokeObjectUrl(url: string) {
    if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
    }
}

function clearCropImage() {
    revokeObjectUrl(cropObjectUrl.value)
    cropObjectUrl.value = ''
    cropImg.value = ''
}

function clearAvatarPreview() {
    revokeObjectUrl(avatarPreviewObjectUrl.value)
    avatarPreviewObjectUrl.value = ''
}

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
    clearCropImage()
    cropObjectUrl.value = URL.createObjectURL(file)
    cropImg.value = cropObjectUrl.value
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
        clearAvatarPreview()
        avatarPreviewObjectUrl.value = URL.createObjectURL(avatarFile.value)
        usingAvatar.value = avatarPreviewObjectUrl.value
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
    if (avatarFile.value) {
        formData.append('avatar', avatarFile.value)
    }
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
                if (isTeacher()) {
                    originalValues.value.question_box_perm = questionVisible.value
                }
                showSaveReminder.value = false
                hasUnsavedChanges = false

                await getUserInfoApi().then((res) => {
                    if (res) {
                        userStore.setUser(res)
                        usingAvatar.value = res.avatar ? res.avatar : ''
                        originalValues.value.avatar = usingAvatar.value
                        avatarFile.value = null
                        clearAvatarPreview()
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
        .catch(() => {
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

const showDeactivate = ref(false)

function showDeactivateDialog() {
    showDeactivate.value = true
}

const questionVisible = ref(userStore.getUser().question_box_perm)

// 监听教师可见性设置变化
if (isTeacher()) {
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

if (isTeacher()) {
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

onUnmounted(() => {
    clearCropImage()
    clearAvatarPreview()
})
</script>

<style lang="scss" scoped src="./setting.scss"></style>

<style lang="scss" scoped>
:deep(.el-dialog) {
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

:deep(.el-switch) {
    height: 24px;
    --el-switch-on-color: #4caf50;
    --el-switch-off-color: #dcdfe6;
    --el-switch-core-border-radius: 12px;

    .el-switch__core {
        width: 48px !important;
        height: 24px;
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 0 4px rgba(76, 175, 80, 0.4);
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
</style>
