import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const AskHistory = () =>
    import("@/views/ask-history");

export const AskHistoryRoute: AppRouteRecordRaw = {

    path: "/ask-history",
    name: "AskHistoryRoot",
    meta: {
        title: "历史提问",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: "",
            name: "AskHistory",
            meta: {
                title: "历史提问",
            },
            components: {
                default: AskHistory,
                left_side: LeftSidebar,
            },
        },
    ]
}