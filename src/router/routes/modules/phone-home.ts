import type { AppRouteRecordRaw } from "@/router/types";
import PhoneHome from '@/views/phone/phone-home.vue'
import Setting from '@/views/Setting.vue'


export const PhoneHomeRoute: AppRouteRecordRaw = {
    path: '/phone',
    name: 'phone',
    component: PhoneHome,
    children: [
        {
            path: 'setting',
            name: 'phone-setting',
            component: Setting,
        }
    ]
}