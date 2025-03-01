import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");
const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const AskMe = () => import("@/views/ask-me/AskMe.vue");
const AskMeMul = () => import("@/views/ask-me-mul/AskMeMul.vue");

export const AskMeRoute: AppRouteRecordRaw = {
    path: "/ask-me",
    name: "AskMeRoot",
    meta: {
        title: "我的提问箱",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: WebHome,
    children: [
        {
            path: "",
            name: "AskMe",
            meta: {
                title: "我的提问箱",
            },
            components: {
                default: AskMe,
                left_side: LeftSidebar,
            },
        },
        {
            path: "answered",
            name: "AskMeAnswered",
            meta: {
                title: "已回答",
            },
            components: {
                default: AskMeMul,
                left_side: LeftSidebar,
            },
            props: {
                default: { type: "answered" },
            },
        },
        {
            path: "unanswered",
            name: "AskMeUnanswered",
            meta: {
                title: "未回答",
            },
            components: {
                default: AskMeMul,
                left_side: LeftSidebar,
            },
            props: {
                default: { type: "unanswered" },
            },
        },
        {
            path: "top",
            name: "AskMeTop",
            meta: {
                title: "置顶",
            },
            components: {
                default: AskMeMul,
                left_side: LeftSidebar,
            },
            props: {
                default: { type: "top" },
            },
        },
    ],
};
