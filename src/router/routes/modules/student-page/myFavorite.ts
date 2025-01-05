import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const MyFavorite = () => import("@/views/my-favorites");

export const MyFavoriteRoute: AppRouteRecordRaw = {

    path: "/my-favorite",
    name: "MyFavoriteRoot",
    meta: {
        title: "我的收藏",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: "",
            name: "MyFavorite",
            meta: {
                title: "我的收藏",
            },
            components: {
                default: MyFavorite,
                left_side: LeftSidebar,
            },
        },
    ]
}