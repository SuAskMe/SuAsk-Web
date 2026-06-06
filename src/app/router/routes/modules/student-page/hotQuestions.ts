import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')
const HotQuestions = () => import('@/views/hot/HotQuestions.vue')

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
