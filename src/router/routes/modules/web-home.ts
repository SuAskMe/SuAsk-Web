import type { AppRouteRecordRaw } from "@/router/types";

export const WebHomeRoute: AppRouteRecordRaw = {
    path: '/web',
    name: 'web',
    component: () => import('@/views/web/web-home.vue'),
    children: [
        {
            path: 'setting',
            name: 'web-setting',
            component: () => import('@/views/Setting.vue'),
        }
    ]

}