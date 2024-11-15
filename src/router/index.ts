import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '../views/404.vue'
import WebHome from '../views/web/web-home.vue'

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
            component: WebHome,

        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
        },
    ],
})

export default router
