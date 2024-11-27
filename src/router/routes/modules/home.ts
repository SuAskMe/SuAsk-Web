import type { AppRouteRecordRaw } from "@/router/types";
import { isMobile } from "@/utils/device"


const WebHome = () => import('@/layout/home/WebHome.vue')
const PhoneHome = () => import('@/layout/home/PhoneHome.vue')
const Setting = () => import('@/views/home/content/setting/Setting.vue')
const AskAll = () => import('@/views/home/content/ask-all/AskAll.vue')
const AskTeacher = () => import('@/views/home/content/ask-teacher/AskTeacher.vue')
const AskHistory = () => import('@/views/home/content/ask-history/AskHistory.vue')
const MyFavorite = () => import('@/views/home/content/my-favorites/MyFavorites.vue')
const Help = () => import('@/views/home/content/help/Help.vue')
const Sidebar = () => import('@/views/home/sidebar/Sidebar.vue')
const Header = () => import('@/views/home/header/Header.vue')
const SearchFooter = () => import('@/views/home/footer/SearchFooter.vue')
const PhoneMainFooter = () => import('@/views/home/footer/phone/PhoneMainFooter.vue')



export const HomeRoute: AppRouteRecordRaw = {
    path: '/home',
    name: 'Home',
    meta: {
        title: '主页',
    },
    props: {
        user: 'student',
        deviceType: isMobile() ? 'phone' : 'desktop'
    },
    component: isMobile() ? PhoneHome : WebHome,
    children: [
        {
            path: '',
            name: 'Index',
            redirect: 'home/setting'
        },
        {
            path: 'setting',
            name: 'Setting',
            meta: {
                title: '设置'
            },
            components: {
                default: Setting,
                sidebar: Sidebar,
                header: Header,
                footer: PhoneMainFooter
            },
        },
        {
            path: 'ask-all',
            name: 'AskAll',
            meta: {
                title: '问大家'
            },
            component: AskAll
        },
        {
            path: 'ask-teacher',
            name: 'AskTeacher',
            meta: {
                title: '问老师'
            },
            component: AskTeacher
        },
        {
            path: 'ask-history',
            name: 'AskHistory',
            meta: {
                title: '历史提问'
            },
            component: AskHistory
        },
        {
            path: 'my-favorite',
            name: 'MyFavorite',
            meta: {
                title: '我的收藏'
            },
            component: MyFavorite
        },
        {
            path: 'help',
            name: 'Help',
            meta: {
                title: '帮助'
            },
            component: Help
        }
    ]
}
