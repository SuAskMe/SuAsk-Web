import type { AppRouteRecordRaw } from '../types'
import { PageNotFound } from './basic'
import { AskTeacherRoute } from './modules/student-page'
import { HotQuestionsRoute } from './modules/student-page'
import { HelpRoute } from './modules/help'
import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import { MyFavoriteRoute } from './modules/student-page'
import { SettingRoute } from './modules/setting'
import { UserRoute } from './modules/userInfo'
import { AskHistoryRoute } from './modules/student-page'
import { QuestionDetailRoute } from './modules/questionDetail'
import { AskMeRoute } from './modules/teacher-page'
import { AnnouncementListRoute } from './modules/announcement'

// 根路由
export const RootRoot: AppRouteRecordRaw = {
    path: '/',
    name: 'Root',
    meta: {
        title: 'SuAsk • 速问',
    },
    component: HomePage,
}

// 登录路由
export const LoginRoute: AppRouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
        title: '登录',
    },
}

// 最基础的路由
export const basicRoutes = [LoginRoute, RootRoot, PageNotFound]

// Guest 路由
export const guestRoutes = [
    HelpRoute,
    UserRoute,
    AskTeacherRoute,
    HotQuestionsRoute,
    QuestionDetailRoute,
    SettingRoute,
    AskHistoryRoute,
]

// 学生路由
export const studentRoutes = [
    HelpRoute,
    UserRoute,
    AskTeacherRoute,
    HotQuestionsRoute,
    QuestionDetailRoute,
    SettingRoute,
    AskHistoryRoute,
    MyFavoriteRoute,
    AnnouncementListRoute,
]

// 教师路由
export const teacherRoutes = [
    HelpRoute,
    UserRoute,
    AskTeacherRoute,
    HotQuestionsRoute,
    QuestionDetailRoute,
    SettingRoute,
    AskHistoryRoute,
    MyFavoriteRoute,
    AskMeRoute,
    AnnouncementListRoute,
]
