import request from '@/utils/http/request'

// ==================== 类型定义 ====================

/** 管理员用户列表项 */
export interface AdminUserItem {
    id: number
    name: string
    nickname: string
    email: string
    role: 'admin' | 'teacher' | 'student' | 'guest'
    introduction: string
    avatar: string
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

export type AdminQuestionStatus = 'answered' | 'unanswered'
export type AdminQuestionVisibility = 'public' | 'private'

/** 管理员问题列表项 */
export interface AdminQuestionItem {
    id: number
    title: string
    contents: string
    src_user_id: number
    src_user_name: string
    src_user_nickname: string
    dst_user_id: number
    dst_user_name: string
    dst_user_nickname: string
    is_private: boolean
    created_at: number
    views: number
    reply_cnt: number
    answer_count: number
    matched_answer_count: number
    status: AdminQuestionStatus
    is_deleted: boolean
    deleted_at: number
}

/** 管理员问题列表查询参数 */
export interface AdminQuestionListParams {
    page: number
    keyword?: string
    status?: '' | 'all' | AdminQuestionStatus
    visibility?: '' | 'all' | AdminQuestionVisibility
    teacher_id?: number
    include_deleted?: boolean
}

/** 管理员问题列表响应 */
export interface AdminQuestionListRes {
    list: AdminQuestionItem[]
    total: number
    remain_page: number
}

/** 管理员问题详情中的回答 */
export interface AdminQuestionAnswerItem {
    id: number
    question_id: number
    user_id: number
    user_name: string
    user_nickname: string
    user_role: 'admin' | 'teacher' | 'student' | 'guest' | ''
    contents: string
    created_at: number
    upvotes: number
    in_reply_to: number
    is_deleted: boolean
    deleted_at: number
}

/** 管理员问题详情响应 */
export interface AdminQuestionDetailRes {
    question: AdminQuestionItem
    answers: AdminQuestionAnswerItem[]
}

/** 通用 ID 响应 */
export interface AdminIdRes {
    id: number
}

// ==================== API 路径 ====================

enum Api {
    USERS = '/admin/users',
    QUESTIONS = '/admin/questions',
}

// ==================== API 函数 ====================

/** 获取管理员用户列表 */
export async function getAdminUserList(
    page: number,
    role?: string,
    keyword?: string,
): Promise<AdminUserListRes> {
    return request.get(Api.USERS, { params: { page, role, keyword } }).then((res) => {
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

/** 修改用户头像 */
export async function updateAdminUserAvatar(
    id: number,
    file: File,
): Promise<{ id: number; avatar: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    return request
        .put(`${Api.USERS}/${id}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
            if (res) {
                return res.data
            }
        })
}

/** 获取管理员问题列表 */
export async function getAdminQuestionList(
    params: AdminQuestionListParams,
): Promise<AdminQuestionListRes> {
    return request.get(Api.QUESTIONS, { params }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

/** 获取管理员问题详情 */
export async function getAdminQuestionDetail(
    id: number,
    includeDeleted?: boolean,
): Promise<AdminQuestionDetailRes> {
    return request
        .get(`${Api.QUESTIONS}/${id}`, { params: { include_deleted: includeDeleted } })
        .then((res) => {
            if (res) {
                return res.data
            }
        })
}

/** 管理员删除问题 */
export async function deleteAdminQuestion(id: number): Promise<AdminIdRes> {
    return request.delete(`${Api.QUESTIONS}/${id}`).then((res) => {
        if (res) {
            return res.data
        }
    })
}

/** 管理员删除问题下的回答 */
export async function deleteAdminQuestionAnswer(
    questionId: number,
    answerId: number,
): Promise<AdminIdRes> {
    return request.delete(`${Api.QUESTIONS}/${questionId}/answers/${answerId}`).then((res) => {
        if (res) return res.data
    })
}
