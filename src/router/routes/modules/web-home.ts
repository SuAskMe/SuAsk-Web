import type { AppRouteRecordRaw } from "@/router/types";
import WebHome from '@/views/web/web-home.vue'
import Setting from '@/views/Setting.vue'

export const WebHomeRoute: AppRouteRecordRaw = {
    path: '/web',
    name: 'web',
    component: WebHome,
    children: [
        {
            path: 'setting',
            name: 'web-setting',
            component: Setting,
        }
    ]

}