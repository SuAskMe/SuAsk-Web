import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const Help = () => import("@/views/help");

export const HelpRoute: AppRouteRecordRaw = {

    path: "/help",
    name: "HelpRoot",
    meta: {
        title: "帮助",
        
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: WebHome,
    children: [
        {
            path: "",
            name: "Help",
            meta: {
                title: "帮助",
            },
            components: {
                default: Help,
                left_side: LeftSidebar,
            },
        },
    ]
}