<template>
    <el-container class="container">
        <div class="main-container" ref="mainContainer">
            <el-scrollbar @scroll="checkStickyHeader">
                <div class="header" ref="stickyHeader">
                    <div class="header-content">
                        <el-autocomplete v-model="searchInput" placeholder="请输入想要搜索的老师姓名"
                            :fetch-suggestions="querySearch" :debounce="100" @input="resetList"
                            clearable></el-autocomplete>
                        <div class="search-teacher-btn" @click.stop="searchBtn">
                            <SvgIcon icon="search" size="calc(1em + 10px)" color="#71b6ff" />
                        </div>
                        <div :class="{ 'bottom-line': isAtTop }"></div>
                    </div>
                </div>
                <div class="teacher-list">
                    <TeacherCard v-for="(teacher, index) in teacherList" :key="index" :teacher="teacher"
                        :click-card="navigateTo">
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
import type { TeacherItem } from "@/model/teacher.model";
import { router } from "@/router";

async function getTeacherList() {
    await getTeacherApi().then((res) => {
        if (res) {
            teacherList.value = res.teachers;
            console.log(teacherList.value);
        }

    }).then(() => {
        let teachersObj = teacherList.value
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

const navigateTo = (key: number) => {
    router.push({
        path: `/ask-teacher/${key}`,
    });
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
