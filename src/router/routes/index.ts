import type { AppRouteModule, AppRouteRecordRaw } from "../types"
import { PageNotFound } from "./basic"
import { HomeRoute } from "./modules/home"
import HomePage from '@/views/root-page/HomePage.vue'



// 根路由
export const RootRoot: AppRouteRecordRaw = {
    path: '/',
    name: 'Root',
    meta: {
        title: 'SuAsk • 速问',
    },
    component: HomePage,
}

// 登录路由
export const LoginRoute: AppRouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login.vue'),
    meta: {
        title: '登录',
    },
}

export const TestRoute: AppRouteRecordRaw = {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/TestPage.vue'),
    meta: {
        title: '测试',
    },
}

export const basicRoutes = [
    HomeRoute,
    LoginRoute,
    TestRoute,
    RootRoot,
    PageNotFound,
]