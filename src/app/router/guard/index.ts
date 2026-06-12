import { UserStore } from '@/entities/user'
import type { Router } from 'vue-router'
import { basicRoutes, guestRoutes, studentRoutes, teacherRoutes } from '../routes'
import type { AppRouteRecordRaw } from '../types'

export const routeMap = new Map<string, string[]>()

export function createRouterGuard(router: Router) {
    createRoleMap()
    createRoleGuard(router)
}

export function createRoleMap() {
    const addRoutesToMap = (routes: AppRouteRecordRaw[], role: string) => {
        routes.forEach((route) => {
            if (routeMap.has(route.name)) {
                routeMap.get(route.name)!.push(role)
            } else {
                routeMap.set(route.name, [role])
            }
        })
    }

    addRoutesToMap(basicRoutes, 'basic')
    addRoutesToMap(guestRoutes, 'guest')
    addRoutesToMap(studentRoutes, 'student')
    addRoutesToMap(teacherRoutes, 'teacher')
}

let authPromise: Promise<void> | null = null

function ensureBootstrapAuth() {
    if (!authPromise) {
        authPromise = new Promise((resolve) => {
            const userStore = UserStore()
            userStore.bootstrapAuth().finally(() => resolve())
        })
    }
    return authPromise
}

export function createRoleGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const name = to.name?.toString() + 'Root'
        const userStore = UserStore()

        // Wait for auth bootstrap to complete if it hasn't yet.
        if (!userStore.authReady) {
            await ensureBootstrapAuth()
        }

        const userRole = userStore.getRole()

        // 未登录且不是基础路由 → 重定向到登录页
        const isBasicRoute = basicRoutes.some(
            (r) => r.name === name || r.name === to.name?.toString(),
        )
        if (!userStore.isLoggedIn() && !isBasicRoute) {
            sessionStorage.setItem('login_redirect', to.fullPath)
            const loginQuery = new URLSearchParams({ redirect: to.fullPath })
            next(`/login?${loginQuery.toString()}`)
            return
        }

        // 检查 requiresAdmin meta
        if (to.meta.requiresAdmin) {
            if (userRole !== 'admin') {
                next({ name: 'NotFound' })
                return
            }
            next()
            return
        }

        // admin 可以访问所有路由
        if (userRole === 'admin') {
            next()
            return
        }

        const roles = routeMap.get(name)
        if (roles) {
            if (!roles.includes(userRole)) {
                next({ name: 'NotFound' })
                return
            }
        }
        next()
    })
}
