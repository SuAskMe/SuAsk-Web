import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/shared/lib/device'

const WebHome = () => import('@/app/layouts/main-layout')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const AskMe = () => import('@/pages/ask-me')

export const AskMeRoute: AppRouteRecordRaw = {
    path: '/ask-me',
    name: 'AskMeRoot',
    meta: {
        title: '我的提问箱',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'AskMe',
            meta: {
                title: '我的提问箱',
            },
            components: {
                default: AskMe,
                left_side: LeftSidebar,
            },
        },
    ],
}
