import { UserStore } from '@/store/modules/user'
import { AdminModeStore } from '@/store/modules/admin-mode'
import type { Router } from 'vue-router'
import { basicRoutes, defaultRoutes, studentRoutes, teacherRoutes } from '../routes'
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
    addRoutesToMap(defaultRoutes, 'default')
    addRoutesToMap(studentRoutes, 'student')
    addRoutesToMap(teacherRoutes, 'teacher')
}

export function createRoleGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const name = to.name?.toString() + 'Root'
        const userRole = UserStore().getRole()

        // 检查 requiresAdmin meta：非 admin 用户重定向到 404
        if (to.meta.requiresAdmin) {
            if (userRole !== 'admin') {
                next({ name: 'NotFound' })
                return
            }
            // admin 用户访问管理路由时自动开启管理员模式
            const adminModeStore = AdminModeStore()
            adminModeStore.enable()
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
