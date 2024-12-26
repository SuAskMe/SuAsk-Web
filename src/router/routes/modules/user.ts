import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");
const Sidebar = () => import("@/views/home/sidebar/Sidebar.vue");

const User = () => import("@/views/user/User.vue")

export const UserRoute: AppRouteRecordRaw = {

    path: "/user",
    name: "UserRoot",
    meta: {
        title: "用户",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: ":id",
            name: "User",
            meta: {
                title: "用户",
            },
            components: {
                default: User,
                sidebar: Sidebar,
            },
        },
    ]
}