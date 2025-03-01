import { LeftSidebar } from "@/components/left-sidebar";
import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const Home = () => import("@/views/home");

export const HomeRoute: AppRouteRecordRaw = {

    path: "/home",
    name: "HomeRoot",
    meta: {
        title: "主页",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: WebHome,
    children: [
        {
            path: "",
            name: "Home",
            meta: {
                title: "主页",
            },
            components: {
                default: Home,
                // left_side: LeftSidebar,
            },
        },
    ]
}