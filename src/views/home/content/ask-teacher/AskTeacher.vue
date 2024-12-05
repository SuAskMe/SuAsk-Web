<template>
    <el-container class="container">
        <el-mian class="main-container" ref="mainContainer">
            <el-scrollbar @scroll="checkStickyHeader">
                <div class="header" ref="stickyHeader">
                    <div class="header-content">
                        <el-autocomplete
                            v-model="searchInput"
                            placeholder="请输入想要搜索的老师姓名"
                            :fetch-suggestions="querySearch"
                            clearable
                        ></el-autocomplete>
                        <div class="search-teacher-btn">
                            <SvgIcon
                                icon="search"
                                size="calc(1em + 10px)"
                                color="#71b6ff"
                            />
                        </div>
                        <div :class="{ 'bottom-line': isAtTop }"></div>
                    </div>
                </div>
                <div class="teacher-list">
                    <TeacherCard
                        v-for="teacher in teacherList"
                        :key="teacher.name"
                        :teacher="teacher"
                    />
                </div>
            </el-scrollbar>
        </el-mian>
    </el-container>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/svg-icon";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import TeacherCard from "./TeacherCard.vue";

const teachers = [
    {
        name: "郑子彬",
        avatar: "https://sse.sysu.edu.cn/sites/default/files/styles/image_style_2/public/%E9%83%91%E5%AD%90%E5%BD%AC_0.jpg?itok=IFxeXGlr", // 替换为实际图片地址
        introduction:
            "软件可靠性、程序分析、区块链、智能合约、可信软件。本科...",
        email: null,
        count: 100,
    },
    {
        name: "余阳",
        avatar: "https://via.placeholder.com/150",
        introduction: "工作流/BPM、服务计算/云计算、网络社会协作、软件工程。",
        email: "yuy@mail.sysu.edu.cn",
        count: 50,
    },
    {
        name: "王国利",
        avatar: "https://via.placeholder.com/150",
        introduction: "普适计算、泛在感知与泛在智能。",
        email: null,
        count: 10,
    },
    {
        name: "王若梅",
        avatar: "https://via.placeholder.com/150",
        introduction:
            "计算机图形学理论和应用，三维计算机仿真，视频数据分析与处理。",
        email: null,
        count: 20,
    },
    {
        name: "aaa",
        avatar: "https://via.placeholder.com/150",
        introduction: "算法设计与分析，演化算法。",
        email: null,
        count: 15,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        introduction: "软件工程、软件测试、软件质量保证。",
        email: "chenwuh@mail.sysu.edu.cn",
        count: 30,
    },
];

type TeacherItem = {
    value?: string;
    name: string; // 老师姓名
    avatar: string; // 老师头像
    // level: string; // 老师级别
    introduction: string; // 老师介绍
    email: string | null; // 老师邮箱
    count: number; // 老师回复数量
};

const searchInput = ref("");
const teacherList: TeacherItem[] = reactive(teachers);

const querySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? teacherList.filter(createFilter(queryString))
        : teacherList;
    // call callback function to return suggestions
    cb(results);
};
const createFilter = (queryString: string) => {
    return (teacher: TeacherItem) => {
        // console.log(teacher.name.toLowerCase(), queryString.toLowerCase());
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
onMounted(() => {
    teacherList.forEach((teacher) => {
        teacher.value = teacher.name;
    });
});
</script>

<style scoped src="./AskTeacher.scss" />
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
