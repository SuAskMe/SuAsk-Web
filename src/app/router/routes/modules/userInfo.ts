import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')

const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const UserInfo = () => import('@/pages/user-profile')

export const UserRoute: AppRouteRecordRaw = {
    path: '/user',
    name: 'UserRoot',
    meta: {
        title: '用户',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: ':id',
            name: 'User',
            meta: {
                title: '用户',
            },
            components: {
                default: UserInfo,
                left_side: LeftSidebar,
            },
        },
    ],
}
