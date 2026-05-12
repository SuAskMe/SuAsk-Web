import request from '@/utils/http/request'

// ==================== 类型定义 ====================

/** 管理员用户列表项 */
export interface AdminUserItem {
    id: number
    name: string
    nickname: string
    email: string
    role: 'admin' | 'teacher' | 'student'
    introduction: string
    created_at: string
}

/** 用户列表响应 */
export interface AdminUserListRes {
    list: AdminUserItem[]
    total: number
    remain_page: number
}

/** 创建用户请求参数 */
export interface CreateAdminUserReq {
    name: string
    password: string
    email: string
    role: 'admin' | 'teacher' | 'student'
    nickname: string
    introduction?: string
    perm?: string
}

/** 更新用户请求参数 */
export interface UpdateAdminUserReq {
    nickname?: string
    email?: string
    role?: string
    introduction?: string
    perm?: string
}

/** 通用 ID 响应 */
export interface AdminIdRes {
    id: number
}

// ==================== API 路径 ====================

enum Api {
    USERS = '/admin/users',
}

// ==================== API 函数 ====================

/** 获取管理员用户列表 */
export async function getAdminUserList(
    page: number,
    role?: string,
    keyword?: string,
): Promise<AdminUserListRes> {
    return request
        .get(Api.USERS, { params: { page, role, keyword } })
        .then((res) => {
            if (res) {
                return res.data
            }
        })
}

/** 创建用户 */
export async function createAdminUser(data: CreateAdminUserReq): Promise<AdminIdRes> {
    return request.post(Api.USERS, data).then((res) => {
        if (res) {
            return res.data
        }
    })
}

/** 更新用户 */
export async function updateAdminUser(id: number, data: UpdateAdminUserReq): Promise<AdminIdRes> {
    return request.put(`${Api.USERS}/${id}`, data).then((res) => {
        if (res) {
            return res.data
        }
    })
}

/** 重置用户密码 */
export async function resetAdminUserPassword(id: number, password: string): Promise<AdminIdRes> {
    return request.put(`${Api.USERS}/${id}/password`, { password }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

/** 删除用户 */
export async function deleteAdminUser(id: number): Promise<AdminIdRes> {
    return request.delete(`${Api.USERS}/${id}`).then((res) => {
        if (res) {
            return res.data
        }
    })
}
