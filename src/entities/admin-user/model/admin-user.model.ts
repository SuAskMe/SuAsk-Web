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

export interface AdminUserListRes {
    list: AdminUserItem[]
    total: number
    remain_page: number
}

export interface CreateAdminUserReq {
    name: string
    password: string
    email: string
    role: 'admin' | 'teacher' | 'student'
    nickname: string
    introduction?: string
    perm?: string
}

export interface UpdateAdminUserReq {
    nickname?: string
    email?: string
    role?: string
    introduction?: string
    perm?: string
}

export interface AdminUserIdRes {
    id: number
}

export interface UpdateAdminUserAvatarRes {
    id: number
    avatar: string
}
