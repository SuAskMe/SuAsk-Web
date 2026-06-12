import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { basicRoutes, guestRoutes, studentRoutes, teacherRoutes } from './routes'
import { adminRoutes } from './routes/admin'
import type { App } from 'vue'
import { createRouterGuard } from './guard'

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...basicRoutes,
        ...guestRoutes,
        ...studentRoutes,
        ...teacherRoutes,
        ...adminRoutes,
    ] as unknown as RouteRecordRaw[],
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function setupRouter(app: App<Element>) {
    app.use(router)
    createRouterGuard(router)
}

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title as string
    }
    next()
})
