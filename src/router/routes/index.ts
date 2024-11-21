import type { AppRouteRecordRaw } from "../types"
import { PageNotFound } from "./basic"
import { PhoneHomeRoute } from "./modules/phone-home"
import { WebHomeRoute } from "./modules/web-home"
import HomePage from '@/views/home-page/home-page.vue'

export const RootRoot: AppRouteRecordRaw = {
    path: '/',
    name: 'Root',
    meta: {
        title: 'Root',
    },
    component: HomePage,
}

export const basicRoutes = [
    RootRoot,
    PageNotFound,
    PhoneHomeRoute,
    WebHomeRoute,
]