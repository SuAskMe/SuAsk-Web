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
                        <el-avatar :size="deviceType == 'desktop' ? 200 : 150" :src="basicInfo.avatar" />
                        <el-upload action="" :show-file-list="false" :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
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
import type { User } from '@/model/user.model';

const imgList = ref<string[]>([]);
const images = import.meta.glob('@/assets/bg_imgs/*.png', { eager: true });
imgList.value = Object.values(images).map((module) => (module as any).default);

const deviceType = inject('deviceType', 'desktop');

interface BasicInfo {
    avatar: string
    name: string
    nickname: string
    introduction: string
    themeId: number
}

const basicInfo: BasicInfo = reactive({
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    name: 'GenshinStart',
    nickname: '原神启动',
    introduction: '原神启动的个人简介',
    themeId: 3
})

const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) as User : null

function getUserInfo() {
    if (userInfo) {
        const parsedUserInfo = userInfo
        basicInfo.avatar = parsedUserInfo.avatar
        basicInfo.name = parsedUserInfo.name
        basicInfo.nickname = parsedUserInfo.nickname
        basicInfo.introduction = parsedUserInfo.introduction
        basicInfo.themeId = parsedUserInfo.themeId
    } else {
        ElMessage.error('获取用户信息失败')
    }
}

async function updateUserInfo() {
    if (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        await updateUserInfoApi(userInfo).then(res => {
            if (res) {
                ElMessage.success('保存成功')
            } else {
                ElMessage.error('保存失败')
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error('保存失败')
        })
    }
    ElMessage.success('保存成功')

}

onMounted(() => {
    getUserInfo()
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    basicInfo.avatar = URL.createObjectURL(uploadFile.raw!)
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

async function loadCss() {
    if (deviceType === 'desktop') {
        await import('./desktop.scss');
    } else {
        await import('./phone.scss');
    }

}

onMounted(() => {
    loadCss();
})

watch(() => deviceType, () => {
    loadCss();
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

<style lang="scss" scoped>
:deep(.el-dialog) {
    border-radius: 15px;
}
</style>
