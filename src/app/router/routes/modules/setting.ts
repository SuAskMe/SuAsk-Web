import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/app/layouts/main-layout')

const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const Setting = () => import('@/pages/settings')

export const SettingRoute: AppRouteRecordRaw = {
    path: '/setting',
    name: 'SettingRoot',
    meta: {
        title: '设置',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'Setting',
            meta: {
                title: '设置',
            },
            components: {
                default: Setting,
                left_side: LeftSidebar,
            },
        },
    ],
}
