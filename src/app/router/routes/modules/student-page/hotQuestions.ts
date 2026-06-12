import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/shared/lib/device'

const WebHome = () => import('@/app/layouts/main-layout')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')
const HotQuestions = () => import('@/pages/hot-questions')

export const HotQuestionsRoute: AppRouteRecordRaw = {
    path: '/hot',
    name: 'HotQuestionsRoot',
    meta: {},
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'HotQuestions',
            meta: {
                title: '热点问题',
            },
            components: {
                default: HotQuestions,
                left_side: LeftSidebar,
            },
        },
    ],
}
