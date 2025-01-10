import type { AppRouteRecordRaw } from "../types";
import { PageNotFound } from "./basic";
import { AskAllRoute } from "./modules/student-page";
import { AskTeacherRoute } from "./modules/student-page";
import { HelpRoute } from "./modules/help";
import HomePage from "@/views/root-page/HomePage.vue";
import { MyFavoriteRoute } from "./modules/student-page";
import { SettingRoute } from "./modules/setting";
import { UserRoute } from "./modules/user";
import { AskHistoryRoute } from "./modules/student-page";
import { QuestionDetailRoute } from "./modules/questionDetail";
import { AskMeRoute } from "./modules/teacher-page";
import { HomeRoute } from "./modules/home";

// 根路由
export const RootRoot: AppRouteRecordRaw = {
    path: "/",
    name: "Root",
    meta: {
        title: "SuAsk • 速问",
    },
    component: HomePage,
};

// 登录路由
export const LoginRoute: AppRouteRecordRaw = {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue"),
    meta: {
        title: "登录",
    },
};

export const TestRoute: AppRouteRecordRaw = {
    path: "/test",
    name: "Test",
    component: () => import("@/views/TestPage.vue"),
    meta: {
        title: "测试",
    },
};

export const basicRoutes = [
    HomeRoute,
    LoginRoute,
    TestRoute,
    RootRoot,
    PageNotFound,
    HelpRoute,
    UserRoute,
    AskTeacherRoute,
    QuestionDetailRoute,
];

export const studentRoutes = [
    SettingRoute,
    AskAllRoute,
    AskHistoryRoute,
    MyFavoriteRoute,
]

export const teacherRoutes = [
    SettingRoute,
    AskMeRoute,
]
