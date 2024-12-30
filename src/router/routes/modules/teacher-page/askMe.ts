import { LeftSidebar } from "@/components/left-sidebar";
import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");
const Sidebar = () => import("@/views/home/sidebar/Sidebar.vue");

const AskMe = () => import("@/views/ask-me/AskMe.vue");

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
    component: isMobile() ? PhoneHome : WebHome,
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
    ]
}