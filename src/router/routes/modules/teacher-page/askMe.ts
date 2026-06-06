import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const AskMe = () => import('@/views/ask-me/AskMe.vue')

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
