import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '../views/404-page.vue'
import WebHome from '../views/web/web-home.vue'
import PhoneHome from '../views/phone/phone-home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: '/',
        //     name: 'home',
        //     component: Main,
        // },
        {
            path: '/student',
            name: 'student',
            component: Student_Phone,

        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
        },
        {
            path: '/setting',
            name: 'setting-page',
            component: Setting,
        },
    ],
})

export default router
