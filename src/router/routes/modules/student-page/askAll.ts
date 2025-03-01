import { RightSidebar } from "@/components/right-sidebar";
import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const AskAll = () => import("@/views/ask-all/AskAll.vue");

export const AskAllRoute: AppRouteRecordRaw = {

    path: "/ask-all",
    name: "AskAllRoot",
    meta: {
        title: "问大家",
        permission: "student"
    },
    props: {
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: WebHome,
    children: [
        {
            path: "",
            name: "AskAll",
            meta: {
                title: "问大家",
            },
            components: {
                default: AskAll,
                left_side: LeftSidebar,
            },
        },
    ]
}