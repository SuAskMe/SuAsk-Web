import type { AppRouteRecordRaw } from "@/router/types";


export const PhoneHomeRoute: AppRouteRecordRaw = {
    path: '/phone',
    name: 'phone',
    component: () => import('@/views/phone/phone-home.vue'),
    children: [
        {
            path: 'setting',
            name: 'phone-setting',
            component: () => import('@/views/Setting.vue'),
        }
    ]
}