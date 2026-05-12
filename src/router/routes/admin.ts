import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/components/left-sidebar/LeftSidebar.vue')
const UserManagement = () => import('@/views/admin/UserManagement.vue')

export const AdminUsersRoute: AppRouteRecordRaw = {
    path: '/admin/users',
    name: 'AdminUsersRoot',
    meta: {
        title: '用户管理',
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
            name: 'AdminUsers',
            meta: {
                title: '用户管理',
                requiresAdmin: true,
            },
            components: {
                default: UserManagement,
                left_side: LeftSidebar,
            },
        },
    ],
}

export const adminRoutes: AppRouteRecordRaw[] = [AdminUsersRoute]
