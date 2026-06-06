import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'
import {
    ADMIN_ANNOUNCEMENTS_PATH,
    ADMIN_ANNOUNCEMENTS_ROUTE_NAME,
    ANNOUNCEMENT_LIST_PATH,
    ANNOUNCEMENT_LIST_ROUTE_NAME,
} from '@/entities/announcement'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/components/left-sidebar/LeftSidebar.vue')
const AnnouncementList = () => import('@/views/announcement/AnnouncementList.vue')

export const AnnouncementListRoute: AppRouteRecordRaw = {
    path: ANNOUNCEMENT_LIST_PATH,
    name: ANNOUNCEMENT_LIST_ROUTE_NAME,
    meta: {
        title: '公告中心',
    },
    props: {
        userType: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop',
    },
    component: WebHome,
    children: [
        {
            path: '',
            name: 'AnnouncementList',
            meta: {
                title: '公告中心',
            },
            components: {
                default: AnnouncementList,
                left_side: LeftSidebar,
            },
        },
    ],
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
                default: () => import('@/views/admin/AnnouncementManagement.vue'),
                left_side: LeftSidebar,
            },
        },
    ],
}
