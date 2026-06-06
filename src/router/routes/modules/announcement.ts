import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/components/left-sidebar/LeftSidebar.vue')
const AnnouncementList = () => import('@/views/announcement/AnnouncementList.vue')

export const AnnouncementListRoute: AppRouteRecordRaw = {
    path: '/announcements',
    name: 'AnnouncementListRoot',
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
    path: '/admin/announcements',
    name: 'AdminAnnouncementsRoot',
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
