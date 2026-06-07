/**
 * 统一鉴权工具函数
 *
 * 所有 UI 层面的角色判断都应该用这里的函数，而不是直接写 `role == 'teacher'`。
 * 这样当角色体系变化时（比如新增 admin），只需要改这一个文件。
 */

import { UserStore } from '@/store/modules/user'

/** 当前用户是否已登录（持有有效 token） */
export function isLoggedIn(): boolean {
    return !!UserStore().getToken()
}

/** 当前用户是否是管理员 */
export function isAdmin(): boolean {
    return UserStore().getRole() === 'admin'
}

/** 当前用户是否是老师 */
export function isTeacher(): boolean {
    return UserStore().getRole() === 'teacher'
}

/** 当前用户是否拥有老师级别的能力（老师或管理员） */
export function hasTeacherAbility(): boolean {
    const role = UserStore().getRole()
    return role === 'teacher' || role === 'admin'
}

/** 当前用户是否可以管理内容（删除他人内容、发公告等） */
export function hasAdminAbility(): boolean {
    return UserStore().getRole() === 'admin'
}

/** 判断当前用户是否可以删除指定内容 */
export function canDelete(ownerUserId: number): boolean {
    const store = UserStore()
    const userId = store.getUser().id
    const role = store.getRole()
    if (role === 'admin') return true
    return userId === ownerUserId && userId !== 0
}
