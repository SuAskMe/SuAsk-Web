import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

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
    component: WebHome,
    children: [
        {
            path: ":id",
            name: "User",
            meta: {
                title: "用户",
            },
            components: {
                default: User,
                left_side: LeftSidebar,
            },
        },
    ]
}