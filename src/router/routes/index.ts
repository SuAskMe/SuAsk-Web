import type { AppRouteModule, AppRouteRecordRaw } from "../types"
import { PageNotFound } from "./basic"
import { PhoneHomeRoute } from "./modules/phone-home"
import { WebHomeRoute } from "./modules/web-home"
import HomePage from '@/views/home-page/home-page.vue'



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

export const basicRoutes = [
    LoginRoute,
    RootRoot,
    PageNotFound,
    PhoneHomeRoute,
    WebHomeRoute,
]