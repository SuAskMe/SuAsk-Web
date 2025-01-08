import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device";

const PhoneHome = () => import("@/layout/home/PhoneHome.vue");
const WebHome = () => import("@/layout/home/WebHome.vue");

const LeftSidebar = () => import("@/components/left-sidebar/LeftSidebar.vue");

const QuestionDetail = () =>
    import("@/views/question-detail/QuestionDetail.vue");

export const QuestionDetailRoute: AppRouteRecordRaw = {
    path: "/question-detail",
    name: "QuestionDetailRoot",
    meta: {
        title: "加载中...",
    },
    props: {
        userType: "student",
        deviceType: isMobile() ? "phone" : "desktop",
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: ":id",
            name: "QuestionDetail",
            meta: {},
            components: {
                default: QuestionDetail,
                left_side: LeftSidebar,
            },
        },
    ],
};
