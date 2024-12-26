import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const WebHome = () => import("@/layout/home/WebHome.vue");
const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const Setting = () => import("@/views/home/content/setting/Setting.vue");
const AskAll = () => import("@/views/ask-all/AskAll.vue");
const QuestionDetail = () =>
    import("@/views/home/content/question-detail/QuestionDetail.vue");
const AskTeacher = () =>
    import("@/views/ask-teacher/AskTeacher.vue");
const AskHistory = () =>
    import("@/views/ask-history");
const MyFavorite = () => import("@/views/my-favorites");
const Help = () => import("@/views/home/content/help/Help.vue");
const Sidebar = () => import("@/views/home/sidebar/Sidebar.vue");
const Header = () => import("@/views/home/header/Header.vue");
const SearchFooter = () => import("@/views/home/footer/SearchFooter.vue");
const PhoneMainFooter = () =>
    import("@/views/home/footer/phone/PhoneMainFooter.vue");
const TeacherQuestionBox = () =>
    import("@/views/ask-teacher/TeacherQuestionBox.vue");
const AskMe = () => import("@/views/ask-me/AskMe.vue");

export const HomeRoute: AppRouteRecordRaw = {
    path: "/home",
    name: "Home",
    meta: {},
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: "ask-me",
            name: "AskMe",
            meta: {
                title: "我的提问箱",
            },
            components: {
                default: AskMe,
                sidebar: Sidebar,
            },
        },
        {
            path: "",
            name: "Index",
            meta: {
                title: "Index",
            },
            redirect: "home/setting",
        },
        {
            path: "ask-all",
            name: "AskAll",
            meta: {
                title: "问大家",
            },
            components: {
                default: AskAll,
                sidebar: Sidebar,
            },
        },
        {
            path: "question-detail/:id",
            name: "QuestionDetail",
            meta: {},
            components: {
                default: QuestionDetail,
                sidebar: Sidebar,
            },
        },
        {
            path: "ask-teacher",
            name: "AskTeacher",
            meta: {
                title: "问老师",
            },
            components: {
                default: TeacherQuestionBox,
                sidebar: Sidebar,
            },
        },
        {
            path: "ask-teacher/:id",
            name: "AskTeacherDetail",
            meta: {
                title: "问老师",
            },
            components: {
                default: AskTeacher,
                sidebar: Sidebar,
            },
        },
        {
            path: "ask-history",
            name: "AskHistory",
            meta: {
                title: "历史提问",
            },
            components: {
                default: AskHistory,
                sidebar: Sidebar,
            },
        },
        {
            path: "my-favorite",
            name: "MyFavorite",
            meta: {
                title: "我的收藏",
            },
            components: {
                default: MyFavorite,
                sidebar: Sidebar,
            },
        },
        {
            path: "setting",
            name: "Setting",
            meta: {
                title: "设置",
            },
            components: {
                default: Setting,
                sidebar: Sidebar,
                // header: Header,
                footer: PhoneMainFooter,
            },
            props: {
                // header: { isQuestionPage: false },
                footer: { isQuestionPage: false },
            },
        },
        {
            path: "help",
            name: "Help",
            meta: {
                title: "帮助",
            },
            components: {
                default: Help,
                sidebar: Sidebar,
                footer: PhoneMainFooter,
            },
            props: {
                footer: { isQuestionPage: false },
            },
        },
        {
            path: "user/:id",
            name: "User",
            meta: {
                title: "用户",
            },
            components: {
                default: () => import("@/views/user/User.vue"),
                sidebar: Sidebar,
            },
        },
    ],
};
