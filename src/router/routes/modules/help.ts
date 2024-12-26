import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");
const Sidebar = () => import("@/views/home/sidebar/Sidebar.vue");

const Help = () => import("@/views/home/content/help/Help.vue");

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
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: "",
            name: "Help",
            meta: {
                title: "帮助",
            },
            components: {
                default: Help,
                sidebar: Sidebar,
            },
        },
    ]
}