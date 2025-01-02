export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}

export interface RegisterForm {
    name: string,
    password: string,
    email: string,
    token: string, // 搭载 Email 和过期时间
}

export interface ForgetPasswordForm {
    email: string;
    password: string;
}

export interface UpdateUser {
    nickname: string | null;
    introduction: string | null;
    themeId: number | null;
    // avatarFile: File | null;
}

export interface UpdateAvatar {
    avatarId: number | null;
}

export interface User {
    id: number;
    name: string;
    nickname: string;
    role: string;
    introduction: string;
    avatar: string | null;
    themeId: number;
}

export interface ResetPassword {
    id: number;
    newPassword: string;
}

export interface CheckOldPassword {
    id: number;
    oldPassword: string;
}

export interface LoginReq {
    name: string;
    email: string;
    password: string;
}
export interface LoginRes {
    name: string;
    nickname: string;
    role: string;
    introduction: string;
    email: string;
    avatar: string;
    themeId: number;
    type: string;
}