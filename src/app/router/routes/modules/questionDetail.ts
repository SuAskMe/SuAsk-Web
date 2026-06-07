import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')

const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const QuestionDetail = () => import('@/pages/question-detail')

export const QuestionDetailRoute: AppRouteRecordRaw = {
    path: '/question-detail',
    name: 'QuestionDetailRoot',
    meta: {
        title: '加载中...',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: ':id',
            name: 'QuestionDetail',
            meta: {},
            components: {
                default: QuestionDetail,
                left_side: LeftSidebar,
            },
        },
    ],
}
