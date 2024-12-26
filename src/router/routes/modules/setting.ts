import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");
const Sidebar = () => import("@/views/home/sidebar/Sidebar.vue");

const Setting = () => import("@/views/home/content/setting/Setting.vue");

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
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: "",
            name: "Setting",
            meta: {
                title: "设置",
            },
            components: {
                default: Setting,
                sidebar: Sidebar,
            },
        },
    ]
}