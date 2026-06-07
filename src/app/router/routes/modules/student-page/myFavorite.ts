import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/app/layouts/main-layout')

const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

const MyFavorite = () => import('@/pages/my-favorites')

export const MyFavoriteRoute: AppRouteRecordRaw = {
    path: '/my-favorite',
    name: 'MyFavoriteRoot',
    meta: {
        title: '我的收藏',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'MyFavorite',
            meta: {
                title: '我的收藏',
            },
            components: {
                default: MyFavorite,
                left_side: LeftSidebar,
            },
        },
    ],
}
