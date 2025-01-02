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

const userStore = UserInfoStore()
const { userInfo } = storeToRefs(userStore)

function loadUserInfo() {
    basicInfo.value = userInfo.value
}

async function updateUserInfo() {
    let formData = new FormData()
    formData.append('nickname', basicInfo.value.nickname)
    formData.append('introduction', basicInfo.value.introduction)
    formData.append('themeId', (basicInfo.value.themeId).toString())

    formData.append('avatar', avatarFile.value!)

    await updateUserInfoApi(formData).then(async res => {
        if (res) {
            ElMessage.success('保存成功')
            await getUserInfoApi().then(res => {
                if (res) {
                    userStore.changeUserInfo(res)
                    basicInfo.value = res
                } else {
                    ElMessage.error('保存失败1')
                }
            })
        } else {
            ElMessage.error('保存失败2')
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('保存失败3')
        return
    })
}
onMounted(() => {
    loadUserInfo()
})

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
