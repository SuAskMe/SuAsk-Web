import request from '@/utils/http/request'
import type {
    AdminUserIdRes,
    AdminUserListRes,
    CreateAdminUserReq,
    UpdateAdminUserAvatarRes,
    UpdateAdminUserReq,
} from '../model/admin-user.model'

const USERS_API_PATH = '/admin/users'

export async function getAdminUserList(
    page: number,
    role?: string,
    keyword?: string,
): Promise<AdminUserListRes> {
    return request.get(USERS_API_PATH, { params: { page, role, keyword } }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function createAdminUser(data: CreateAdminUserReq): Promise<AdminUserIdRes> {
    return request.post(USERS_API_PATH, data).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function updateAdminUser(
    id: number,
    data: UpdateAdminUserReq,
): Promise<AdminUserIdRes> {
    return request.put(`${USERS_API_PATH}/${id}`, data).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function resetAdminUserPassword(
    id: number,
    password: string,
): Promise<AdminUserIdRes> {
    return request.put(`${USERS_API_PATH}/${id}/password`, { password }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function deleteAdminUser(id: number): Promise<AdminUserIdRes> {
    return request.delete(`${USERS_API_PATH}/${id}`).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function updateAdminUserAvatar(
    id: number,
    file: File,
): Promise<UpdateAdminUserAvatarRes> {
    const formData = new FormData()
    formData.append('avatar', file)

    return request
        .put(`${USERS_API_PATH}/${id}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
            if (res) {
                return res.data
            }
        })
}
