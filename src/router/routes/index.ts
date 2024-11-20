import type { AppRouteRecordRaw } from "../types"
import WebHome from '@/views/web/web-home.vue'
import { PageNotFound } from "./basic"
import { PhoneHomeRoute } from "./modules/phone-home"
import { WebHomeRoute } from "./modules/web-home"

export const RootRoot: AppRouteRecordRaw = {
    path: '/',
    name: 'Root',
    meta: {
        title: 'Root',
    },
    component: WebHome
}

export const basicRoutes = [
    RootRoot,
    PageNotFound,
    PhoneHomeRoute,
    WebHomeRoute,
]