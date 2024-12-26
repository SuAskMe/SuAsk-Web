import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");
const Sidebar = () => import("@/views/home/sidebar/Sidebar.vue");

const AskAll = () => import("@/views/ask-all/AskAll.vue");

export const AskAllRoute: AppRouteRecordRaw = {

    path: "/ask-all",
    name: "AskAllRoot",
    meta: {
        title: "问大家",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: "",
            name: "AskAll",
            meta: {
                title: "问大家",
            },
            components: {
                default: AskAll,
                sidebar: Sidebar,
            },
        },
    ]
}