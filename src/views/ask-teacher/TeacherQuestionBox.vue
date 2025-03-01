<template>
    <el-container class="container">
        <div class="main-container" ref="mainContainer">
            <el-scrollbar @scroll="checkStickyHeader">
                <div class="header" ref="stickyHeader">
                    <div class="header-content" :style="{ marginTop: deviceTypeStore.isMobile ? 0 : '20vh' }">
                        <div v-if="true" class="search-teacher-btn" style="display: flex; justify-content: center;"
                        @click.stop="sidebar">
                        <svg-icon icon="sidebar" color="#71B6FF" size="calc(1em + 10px)" :filled="sidebarStore.IsOpen" />
                    </div>
                        <el-autocomplete v-model="searchInput" placeholder="请输入想要搜索的老师姓名"
                            :fetch-suggestions="querySearch" :debounce="100" @input="resetList"
                            clearable></el-autocomplete>
                        <div class="search-teacher-btn" @click.stop="searchBtn">
                            <SvgIcon icon="search" size="calc(1em + 10px)" color="#71b6ff" />
                        </div>
                    </div>
                </div>
                <div class="teacher-list">
                    <TeacherCard v-for="(teacher, index) in teacherList" :key="index" :teacher="teacher"
                        :width="deviceTypeStore.isMobile ? '85%' : '40%'" :teacher-key="{
                            teacherId: teacher.id,
                            teacherName: teacher.name,
                            perm: teacher.perm,
                        }" :click-card="navigateTo" :click-btn="navigateToTeacherIndex">
                    </TeacherCard>
                </div>
            </el-scrollbar>
        </div>
    </el-container>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/svg-icon";
import { onMounted, reactive, ref } from "vue";
import TeacherCard from "@/components/teacher-card";
import { getTeacherApi } from "@/api/teacher/teacher.api";
import { TeacherPerm, type TeacherItem } from "@/model/teacher.model";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { UserStore } from "@/store/modules/user";
import { Role } from "@/model/user.model";
import { DeviceTypeStore } from "@/store/modules/device-type";
import { SidebarStore } from "@/store/modules/sidebar";
// import { isMobile } from "@/utils/device";

const deviceTypeStore = DeviceTypeStore();

const sidebarStore = SidebarStore();

const userStore = UserStore();

function sidebar() {
    sidebarStore.toggle();
}

async function getTeacherList() {
    await getTeacherApi()
        .then((res) => {
            if (res) {
                teacherList.value = res.teachers;
                // console.log(teacherList.value);
            }
        })
        .then(() => {
            let teachersObj = teacherList.value;
            for (let i = 0; i < teachersObj.length; i++) {
                teachersObj[i].value = teachersObj[i].name;
            }
            teachersStr = JSON.stringify(teachersObj);
        });
}

let teacherList = ref<TeacherItem[]>([]);

let teachersStr = JSON.stringify(teacherList);

const searchInput = ref("");

const querySearch = (queryString: string, cb: any) => {
    let teachersObj = JSON.parse(teachersStr);
    const results = queryString
        ? teachersObj.filter(createFilter(queryString))
        : teachersObj;
    cb(results);
};
const createFilter = (queryString: string) => {
    return (teacher: TeacherItem) => {
        return (
            teacher.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
    };
};

const stickyHeader = ref();
const mainContainer = ref();
const isAtTop = ref(false);
const checkStickyHeader = () => {
    const top = mainContainer.value.getBoundingClientRect().top;
    const cur = stickyHeader.value.getBoundingClientRect().top;
    const d = cur - top;
    isAtTop.value = d === 0;
};

const resetList = (value: string | number) => {
    // console.log(value);
    if (value === "") {
        teacherList.value = JSON.parse(teachersStr);
    }
};

const searchBtn = () => {
    let teachersObj = JSON.parse(teachersStr);
    const results = searchInput.value
        ? teachersObj.filter(createFilter(searchInput.value))
        : teachersObj;
    teacherList.value = results;
};

const router = useRouter();

const navigateTo = (key: any) => {
    if (key.perm == TeacherPerm.Private) {
        ElMessage({
            showClose: true,
            message: "该老师暂未开启提问箱，您可以邀请老师来加入提问箱",
            type: "success",
            plain: true,
            duration: 4000,
            grouping: true,
        });
        return;
    } else if (
        key.perm == TeacherPerm.Protected &&
        userStore.role == Role.DEFAULT
    ) {
        ElMessage({
            showClose: true,
            message: "该老师提问箱需要您登录之后才能进入",
            type: "success",
            plain: true,
            duration: 4000,
            grouping: true,
        });
        return;
    } else {
        router.push({
            path: `/ask-teacher/${key.teacherId}/${key.teacherName}`,
        });
    }
};

const navigateToTeacherIndex = (key: any) => {
    // router.push({
    //     path: `/teacher-index/${key.teacherId}`,
    //     query: { teacher_id: key.teacherId, teacher_name: key.teacherName },
    // });
    console.log(key);
};

onMounted(() => {
    getTeacherList();
});
</script>

<style scoped src="./TeacherQuestionBox.scss" />
<style>
.header .el-autocomplete {
    width: 50%;

    .el-input {
        --el-input-border-radius: var(--el-border-radius-round);

        .el-input__wrapper {
            padding: 5px 18px;
        }
    }
}
</style>
