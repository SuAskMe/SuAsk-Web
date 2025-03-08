<template>
    <el-container class="container">
        <el-header class="header">
            <QuestionHeader sidebar_btn @sidebar="sidebar" />
        </el-header>
        <el-scrollbar>
            <el-main class="main-container">
                <div class="title">
                    <p>基础信息</p>
                    <hr />
                </div>
                <div class="name-bio-avatar">
                    <div class="name-bio">
                        <p>昵称</p>
                        <div>
                            <el-input
                                v-model="basicInfo.nickname"
                                placeholder="Please input"
                            />
                        </div>
                        <p>简介</p>
                        <div>
                            <bio-panel v-model="basicInfo.introduction" />
                        </div>
                    </div>
                    <div class="avatar-id">
                        <div class="avatar">
                            <el-avatar :size="150" :src="basicInfo.avatar">
                                <img src="@/assets/default-avatar.png" />
                            </el-avatar>
                            <input
                                type="file"
                                ref="imgPicker"
                                accept="image/png,image/jpeg,image/jpg"
                                style="display: none"
                                multiple
                                @change="pickImageImpl"
                            />
                            <el-button
                                @click.stop="pickImage"
                                class="upload-btn"
                                type="default"
                                size="small"
                            >
                                <template #icon>
                                    <svg-icon icon="edit" color="#808080" />
                                </template>
                                编辑
                            </el-button>
                        </div>
                        <p class="id">@{{ basicInfo.name }}</p>
                    </div>
                </div>
                <div class="title">
                    <p>主题</p>
                    <hr />
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
                <div class="title">
                    <hr />
                </div>
                <div class="button">
                    <el-button @click="updateUserInfo" type="primary"
                        >保存更改</el-button
                    >
                </div>
                <div v-if="userStore.getRole() == 'teacher'" class="title">
                    <p>提问箱可见性</p>
                    <hr />
                </div>
                <div
                    v-if="userStore.getRole() == 'teacher'"
                    class="change-perm"
                >
                    <div>
                        <el-radio-group v-model="questionVisible" size="large">
                            <el-radio-button label="公开" value="public" />
                            <el-radio-button label="需登录" value="protected" />
                            <el-radio-button label="关闭" value="private" />
                        </el-radio-group>
                    </div>
                </div>
                <div class="title">
                    <hr />
                </div>
                <div class="password-logout">
                    <p class="danger-option" @click="resetPassword">重置密码</p>
                    <p class="danger-option" @click="showLogoutDialog">
                        退出登录
                    </p>
                </div>
                <div style="height: 50px"></div>
            </el-main>
        </el-scrollbar>
        <reset-password-dialog v-model:visible="showResetPassword" />
        <logout-dialog v-model:visible="showLogout" />
    </el-container>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { getUserInfoApi, updateUserInfoApi } from "@/api/user/user.api";
import { UserStore } from "@/store/modules/user";
import { updateTeacherPermApi } from "@/api/teacher/teacher.api";
import QuestionHeader from "@/components/question-header";
import { SidebarStore } from "@/store/modules/sidebar";
import BioPanel from "@/components/bio-panel/BioPanel.vue";
import { DeviceTypeStore } from "@/store/modules/device-type";
import ThemeImage from "./ThemeImage.vue";
import ResetPasswordDialog from "./ResetPasswordDialog.vue";
import LogoutDialog from "./LogoutDialog.vue";

const imgList = ref<string[]>([]);
const images = import.meta.glob("@/assets/bg_imgs/*.jpg", { eager: true });
imgList.value = Object.values(images).map((module) => (module as any).default);

// const deviceType = inject('deviceType', 'desktop');

const deviceTypeStore = DeviceTypeStore();

const sidebarStore = SidebarStore();

function sidebar() {
    sidebarStore.toggle();
}

const imgPicker = ref<HTMLInputElement>();

function pickImage() {
    if (imgPicker.value) {
        imgPicker.value.click();
    }
}

function pickImageImpl(event: any) {
    const file = event.target.files;
    if (file.length > 1) {
        ElMessage.error("最多上传一张头像");
        return;
    }
    avatarFile.value = file[0];
    basicInfo.value.avatar = URL.createObjectURL(file[0]);
}

const avatarFile = ref<File | null>(null);

const userStore = UserStore();

const basicInfo = computed(() => userStore.getUser());

async function updateUserInfo() {
    let formData = new FormData();
    formData.append("nickname", basicInfo.value.nickname);
    formData.append("introduction", basicInfo.value.introduction);
    formData.append("themeId", basicInfo.value.themeId.toString());

    formData.append("avatar", avatarFile.value!);

    await updateUserInfoApi(formData)
        .then(async (res) => {
            if (res) {
                ElMessage.success("保存成功");
                await getUserInfoApi().then((res) => {
                    if (res) {
                        userStore.setUser(res);
                    } else {
                        ElMessage.error("保存失败1");
                    }
                });
            } else {
                ElMessage.error("保存失败2");
            }
        })
        .catch((err) => {
            console.log(err);
            ElMessage.error("保存失败3");
            return;
        });
}
onMounted(() => {});

const showResetPassword = ref(false);

function resetPassword() {
    showResetPassword.value = true;
}

const showLogout = ref(false);

function showLogoutDialog() {
    showLogout.value = true;
}

const questionVisible = ref(userStore.getUser().question_box_perm);

watch(
    () => questionVisible.value,
    async (newVal) => {
        await updateTeacherPermApi(questionVisible.value).then(async (res) => {
            if (res) {
                ElMessage.success("保存成功");
                let user = userStore.getUser();
                user.question_box_perm = questionVisible.value;
                userStore.setUser(user);
            } else {
                ElMessage.error("保存失败");
            }
        });
    }
);
</script>

<style lang="scss" scoped src="./setting.scss">
:deep(.el-dialog) {
    border-radius: 15px;
}

:deep(.el-input__wrapper) {
    border-radius: 10px;
}
</style>
