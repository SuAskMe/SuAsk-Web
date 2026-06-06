import type { AppRouteRecordRaw } from '@/router/types'
import { isMobile } from '@/utils/device'
import { AdminAnnouncementsRoute } from './modules/announcement'

const WebHome = () => import('@/layout/home/WebHome.vue')
const LeftSidebar = () => import('@/components/left-sidebar/LeftSidebar.vue')
const UserManagement = () => import('@/views/admin/UserManagement.vue')
const QuestionManagement = () => import('@/views/admin/QuestionManagement.vue')
const QuestionManagementDetail = () => import('@/views/admin/QuestionManagementDetail.vue')

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
