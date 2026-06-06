import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'
import { AdminAnnouncementsRoute } from './modules/announcement'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/widgets/app-shell/left-sidebar')
const UserManagement = () => import('@/pages/admin/user-management')
const QuestionManagement = () => import('@/pages/admin/question-management')
const QuestionManagementDetail = () => import('@/pages/admin/question-management/detail')

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

export const AdminQuestionsRoute: AppRouteRecordRaw = {
    path: '/admin/questions',
    name: 'AdminQuestionsRoot',
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
            name: 'AdminQuestions',
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
            name: 'AdminQuestionDetail',
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
