export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    GUEST = 'guest',
}

export interface UpdateUser {
    nickname: string | null
    introduction: string | null
    themeId: number | null
    notifySwitch: boolean | null
    notifyEmail: string | null
    // avatarFile: File | null;
}

export interface User {
    id: number
    name: string
    nickname: string
    email: string
    role: string
    introduction: string
    avatar: string | null
    themeId: number
    question_box_perm: string
    notifySwitch: boolean
    notifyEmail: string
}

export interface UserInfo {
    id: number
    name: string
    nickname: string
    role: string
    introduction: string
    avatar: string | null
    // 以下字段仅当 role=teacher 时有值
    perm?: string
    responses?: number
}

export * from '@/entities/password-reset'
export * from '@/entities/session'
