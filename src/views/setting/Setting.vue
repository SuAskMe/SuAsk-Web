<template>
    <el-container class="container">
        <el-header class="header">
            <QuestionHeader sidebar_btn @sidebar="sidebar" />
        </el-header>
        <el-scrollbar>
            <el-main class="main-container">
                <el-dialog v-model="cropVisible" title="裁剪头像" width="70%" center>
                    <div style="width: auto; height: 400px; margin: 0 auto; position: relative">
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

                    <template #footer>
                        <el-button @click="cropVisible = false">取消</el-button>
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
                                    <el-avatar :size="150" :src="basicInfo.avatar">
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
import { computed, onMounted, ref, watch } from 'vue'
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
imgList.value = Object.values(images).map((module) => (module as any).default)

// const deviceType = inject('deviceType', 'desktop');

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

function pickImageImpl(event: any) {
    const files = event.target.files
    if (files.length > 1) {
        ElMessage.error('最多上传一张头像')
        return
    }
    if (!files) return
    const file = event.target.files[0]
    event.target.value = ''
    // 限制文件类型
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        ElMessage.error('仅支持 JPG/PNG 格式')
        return
    }
    avatarFileType.value = file.type
    cropImg.value = URL.createObjectURL(file)
    cropVisible.value = true
}

const avatarFile = ref<File | null>(null)
const cropVisible = ref(false)
const cropImg = ref('')
const cropper = ref<any>(null)
const avatarFileType = ref('')

// 新增裁剪确认处理
const confirmCrop = async () => {
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
        basicInfo.value.avatar = URL.createObjectURL(avatarFile.value)
        cropVisible.value = false
        imgLoading.close()
    })
}

const userStore = UserStore()

const basicInfo = computed(() => userStore.getUser())

async function updateUserInfo() {
    const formData = new FormData()
    formData.append('nickname', basicInfo.value.nickname)
    formData.append('introduction', basicInfo.value.introduction)
    formData.append('themeId', basicInfo.value.themeId.toString())
    formData.append('avatar', avatarFile.value!)

    await updateUserInfoApi(formData)
        .then(async (res) => {
            if (res) {
                ElMessage.success('保存成功')
                await getUserInfoApi().then((res) => {
                    if (res) {
                        userStore.setUser(res)
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
onMounted(() => {})

const showResetPassword = ref(false)

function resetPassword() {
    showResetPassword.value = true
}

const showLogout = ref(false)

function showLogoutDialog() {
    showLogout.value = true
}

const questionVisible = ref(userStore.getUser().question_box_perm)

if (userStore.getRole() == 'teacher') {
    watch(
        () => questionVisible.value,
        async () => {
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

<style lang="scss" scoped src="./setting.scss">
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
</style>
