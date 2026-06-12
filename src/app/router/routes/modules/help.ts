import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/shared/lib/device'

const WebHome = () => import('@/app/layouts/main-layout')

const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const Help = () => import('@/pages/help')

export const HelpRoute: AppRouteRecordRaw = {
    path: '/help',
    name: 'HelpRoot',
    meta: {
        title: '帮助',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'Help',
            meta: {
                title: '帮助',
            },
            components: {
                default: Help,
                left_side: LeftSidebar,
            },
        },
    ],
}
