import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '../views/404-page.vue'
import WebHome from '../views/web/web-home.vue'
import PhoneHome from '../views/phone/phone-home.vue'
import Setting from '../views/Setting.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: '/',
        //     name: 'home',
        //     component: Main,
        // },
        {
            path: '/web',
            name: 'web',
            component: WebHome,
            children: [
                {
                    path: 'setting',
                    name: 'web-setting',
                    component: Setting,
                }
            ]
        },
        {
            path: '/phone',
            name: 'phone',
            component: PhoneHome,
            children: [
                {
                    path: 'setting',
                    name: 'phone-setting',
                    component: Setting,
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
        },
    ],
})

export default router
