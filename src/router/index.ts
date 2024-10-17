import { createRouter, createWebHistory } from 'vue-router'

import Main from '../views/Main.vue'
import NotFound from '../views/404.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Main,
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
        },
    ],
})

export default router
