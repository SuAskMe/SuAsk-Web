<template>
    <el-scrollbar height="100vh">
        <div class="main">
            <div class="title">
                <p>基础信息</p>
                <hr />
            </div>
            <div class="basic-info">
                <div class="name-and-bio">
                    <p>昵称</p>
                    <div>
                        <el-input v-model="basicInfo.nickname" placeholder="Please input" />
                    </div>
                    <p>简介</p>
                    <div>
                        <bio-panel v-model="basicInfo.introduction" />
                    </div>
                </div>
                <div class="avatar-and-id">
                    <div style="position: relative;">
                        <el-avatar :size="deviceType == 'desktop' ? 200 : 150" :src="basicInfo.avatar">
                            <img src="@/assets/default-avatar.png" />
                        </el-avatar>
                        <el-upload action="http://127.0.0.1:8080/files" :show-file-list="false"
                            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                            :data="{ token: getToken() }">

                            <el-button type="default" size="small">
                                <template #icon>
                                    <svg-icon icon="edit" color="#808080" />
                                </template>
                                编辑
                            </el-button>
                        </el-upload>
                    </div>
                    <p> @{{ basicInfo.name }} </p>
                </div>
            </div>
            <div class="theme-and-button">
                <p>主题</p>
                <div class="theme">
                    <theme-image v-model="basicInfo.themeId" :src="imgList"
                        :width="deviceType == 'desktop' ? '100px' : '70px'" />
                </div>
                <div class="button" v-if="deviceType == 'desktop'">
                    <el-button @click="updateUserInfo" type="primary">保存更改</el-button>
                </div>
            </div>

            <div class="title">
                <hr />
            </div>
            <div class="danger-place">
                <p class="danger-option" @click="resetPassword">重置密码</p>
                <p class="danger-option" @click="showLogoutDialog">账户注销</p>
            </div>
            <el-dialog v-model="showResetPassword" width="400px" align-center>
                <reset-password-dialog />
            </el-dialog>
            <el-dialog v-model="showLogout" width="400px" align-center :modal="false" title="你确定要注销吗?">
                <logout-dialog />
            </el-dialog>
        </div>
    </el-scrollbar>
</template>

<script setup lang='ts'>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import BioPanel from '@/components/bio-panel';
import ThemeImage from './ThemeImage.vue';
import SvgIcon from '@/components/svg-icon';
import { ElMessage, type UploadProps } from 'element-plus';
import ResetPasswordDialog from './ResetPasswordDialog.vue';
import LogoutDialog from './LogoutDialog.vue';
import { updateUserInfoApi } from '@/api/user/user.api';
import type { UpdateAvatar, UpdateUser, User } from '@/model/user.model';

const imgList = ref<string[]>([]);
const images = import.meta.glob('@/assets/bg_imgs/*.png', { eager: true });
imgList.value = Object.values(images).map((module) => (module as any).default);

const deviceType = inject('deviceType', 'desktop');


const basicInfo = ref<User>({
    id: 0,
    role: '',
    avatar: '',
    name: '',
    nickname: '',
    introduction: '',
    themeId: 0
})

const userInfo: User | null = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) as User : null
let avatarId = 0

function getUserInfo() {
    if (userInfo) {
        basicInfo.value.id = userInfo.id
        basicInfo.value.role = userInfo.role
        basicInfo.value.avatar = userInfo.avatar
        basicInfo.value.name = userInfo.name
        basicInfo.value.nickname = userInfo.nickname
        basicInfo.value.introduction = userInfo.introduction
        basicInfo.value.themeId = userInfo.themeId - 1
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

async function updateUserInfo() {
    // localStorage.setItem('userInfo', JSON.stringify(userInfo))
    const updateUserInfo: UpdateUser = {
        avatarId: avatarId === 0 ? null : avatarId,
        nickname: basicInfo.value.nickname,
        introduction: basicInfo.value.introduction,
        themeId: basicInfo.value.themeId + 1
    }
    await updateUserInfoApi(updateUserInfo).then(res => {
        if (!(res instanceof String)) {
            ElMessage.success('保存成功')
            console.log(basicInfo.value);
            updateLocalUserInfo(null, basicInfo.value.nickname, basicInfo.value.introduction, basicInfo.value.themeId + 1)
            location.reload()
        } else {
            ElMessage.error('保存失败')
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('保存失败')
        return
    })
}


function updateLocalUserInfo(avatarURL: string | null, nickname: string | null, introduction: string | null, themeId: number | null) {
    const userInfo: User = JSON.parse(localStorage.getItem('userInfo')!) as User
    if (userInfo) {
        if (nickname) {
            userInfo.nickname = nickname
        }
        if (introduction) {
            userInfo.introduction = introduction
        }
        if (themeId != null) {
            userInfo.themeId = themeId
        }
        if (avatarURL) {
            userInfo.avatar = avatarURL
        }
        console.log(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
}
onMounted(() => {
    getUserInfo()
})

const handleAvatarSuccess: UploadProps['onSuccess'] = async (
    response,
    uploadFile
) => {
    if (response.code != 0) {
        ElMessage.error('上传失败')
        return
    } else {
        avatarId = response.data.id
        const updateUserInfo: UpdateAvatar = {
            avatarId: avatarId,
        }
        await updateUserInfoApi(updateUserInfo).then(res => {
            if (!(res instanceof String)) {
                ElMessage.success('保存成功')
                updateLocalUserInfo(response.data.url, null, null, null)
                location.reload()
            } else {
                ElMessage.error('保存失败')
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error('保存失败')
            return
        })
    }

    basicInfo.value.avatar = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (!rawFile.type.match('image/jpeg|image/png')) {
        ElMessage.error('头像图片格式需要为jpg或png格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过2MB!')
        return false
    }
    return true
}

function getToken() {
    return localStorage.getItem('token')
}


const showResetPassword = ref(false);

function resetPassword() {
    showResetPassword.value = true;
}

const showLogout = ref(false);

function showLogoutDialog() {
    showLogout.value = true;
}
</script>

<style lang="scss" scoped src="./desktop.scss">
:deep(.el-dialog) {
    border-radius: 15px;
}
</style>
