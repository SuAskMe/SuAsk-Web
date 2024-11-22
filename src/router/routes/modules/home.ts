import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/divece"


const WebHome = () => import('@/views/home/WebHome.vue')
const PhoneHome = () => import('@/views/home/PhoneHome.vue')
const Setting = () => import('@/views/home/sider/setting/Setting.vue')

export const HomeRoute: AppRouteRecordRaw = {
    path: '/home',
    name: 'Home',
    meta: {
        title: '主页'
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: 'setting',
            name: 'Setting',
            meta: {
                title: '设置'
            },
            component: Setting
        }
    ]
}
