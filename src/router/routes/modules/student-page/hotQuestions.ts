import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/components/left-sidebar/LeftSidebar.vue')
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
