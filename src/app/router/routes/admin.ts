import type { AppRouteRecordRaw } from '@/app/router/types'
import { isMobile } from '@/utils/device'
import {
    ADMIN_QUESTION_DETAIL_ROUTE_NAME,
    ADMIN_QUESTIONS_CHILD_ROUTE_NAME,
    ADMIN_QUESTIONS_PATH,
    ADMIN_QUESTIONS_ROUTE_NAME,
} from '@/entities/admin-question'
import {
    ADMIN_USERS_CHILD_ROUTE_NAME,
    ADMIN_USERS_PATH,
    ADMIN_USERS_ROUTE_NAME,
} from '@/entities/admin-user'
import { AdminAnnouncementsRoute } from './modules/announcement'

const WebHome = () => import('@/app/layouts/main-layout')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')
const UserManagement = () => import('@/pages/admin/user-management')
const QuestionManagement = () => import('@/pages/admin/question-management')
const QuestionManagementDetail = () => import('@/pages/admin/question-management/detail')

export const AdminUsersRoute: AppRouteRecordRaw = {
    path: ADMIN_USERS_PATH,
    name: ADMIN_USERS_ROUTE_NAME,
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
            name: ADMIN_USERS_CHILD_ROUTE_NAME,
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

export const AdminQuestionsRoute: AppRouteRecordRaw = {
    path: ADMIN_QUESTIONS_PATH,
    name: ADMIN_QUESTIONS_ROUTE_NAME,
    meta: {
        title: '内容管理',
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
            name: ADMIN_QUESTIONS_CHILD_ROUTE_NAME,
            meta: {
                title: '内容管理',
                requiresAdmin: true,
            },
            components: {
                default: QuestionManagement,
                left_side: LeftSidebar,
            },
        },
        {
            path: ':id',
            name: ADMIN_QUESTION_DETAIL_ROUTE_NAME,
            meta: {
                title: '问题详情',
                requiresAdmin: true,
            },
            components: {
                default: QuestionManagementDetail,
                left_side: LeftSidebar,
            },
        },
    ],
}

export const adminRoutes: AppRouteRecordRaw[] = [AdminUsersRoute, AdminQuestionsRoute, AdminAnnouncementsRoute]
