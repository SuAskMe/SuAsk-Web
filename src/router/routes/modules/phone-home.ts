import type { AppRouteRecordRaw } from "@/router/types";


export const PhoneHomeRoute: AppRouteRecordRaw = {
    path: '/phone',
    name: 'phone',
    component: () => import('@/views/phone/PhoneHome.vue'),
    meta: {
        title: '主页',
    },
    children: [
        {
            path: 'setting',
            name: 'phone-setting',
            component: () => import('@/views/setting/Setting.vue'),
            meta: {
                title: '设置',
            },
        }
    ]
}