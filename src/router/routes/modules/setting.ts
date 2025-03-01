import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const Setting = () => import("@/views/setting");

export const SettingRoute: AppRouteRecordRaw = {

    path: "/setting",
    name: "SettingRoot",
    meta: {
        title: "设置",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: WebHome,
    children: [
        {
            path: "",
            name: "Setting",
            meta: {
                title: "设置",
            },
            components: {
                default: Setting,
                left_side: LeftSidebar,
            },
        },
    ]
}