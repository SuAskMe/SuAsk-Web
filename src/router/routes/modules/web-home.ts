import type { AppRouteRecordRaw } from "@/router/types";

export const WebHomeRoute: AppRouteRecordRaw = {
    path: '/web',
    name: 'web',
    meta: {
        title: '主页',
    },
    component: () => import('@/views/web/WebHome.vue'),
    children: [
        {
            path: 'setting',
            name: 'web-setting',
            component: () => import('@/views/setting/Setting.vue'),
            meta: {
                title: '设置',
            }
        }
    ]

}