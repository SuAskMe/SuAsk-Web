import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/shared/lib/device'
import {
    ADMIN_ANNOUNCEMENTS_PATH,
    ADMIN_ANNOUNCEMENTS_ROUTE_NAME,
    ANNOUNCEMENT_LIST_PATH,
    ANNOUNCEMENT_LIST_ROUTE_NAME,
    HELP_ANNOUNCEMENTS_PATH,
} from '@/entities/announcement'

const WebHome = () => import('@/app/layouts/main-layout')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')

export const AnnouncementListRoute: AppRouteRecordRaw = {
    path: ANNOUNCEMENT_LIST_PATH,
    name: ANNOUNCEMENT_LIST_ROUTE_NAME,
    redirect: HELP_ANNOUNCEMENTS_PATH,
    meta: {
        title: '公告中心',
    },
}

export const AdminAnnouncementsRoute: AppRouteRecordRaw = {
    path: ADMIN_ANNOUNCEMENTS_PATH,
    name: ADMIN_ANNOUNCEMENTS_ROUTE_NAME,
    meta: {
        title: '公告管理',
        requiresAdmin: true,
    },
    props: {
        userType: 'admin',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'AdminAnnouncements',
            meta: {
                title: '公告管理',
                requiresAdmin: true,
            },
            components: {
                default: () => import('@/pages/admin/announcement-management'),
                left_side: LeftSidebar,
            },
        },
    ],
}
