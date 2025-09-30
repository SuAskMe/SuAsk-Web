import { UserStore } from '@/store/modules/user'
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
