import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '../views/404.vue'
import Student_Phone from '../views/main-page.vue'
import Setting from '../components/Setting.vue'

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
            name: 'setting',
            component: Setting,
        },
    ],
})

export default router
