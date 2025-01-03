export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}


export interface UpdateUser {
    nickname: string | null;
    introduction: string | null;
    themeId: number | null;
    // avatarFile: File | null;
}

export interface User {
    id: number;
    name: string;
    nickname: string;
    email: string;
    role: string;
    introduction: string;
    avatar: string | null;
    themeId: number;
}

export interface UserInfo {
    id: number;
    name: string;
    nickname: string;
    role: string;
    introduction: string;
    avatar: string | null;
}

export interface SendCodeReq {
    email: string;
    type: string;
}

export interface SendCodeRes {
    code: string;
}

export interface ResetPassword {
    email: string;
    code: string;
    password: string;
}

export interface ForgetPassword {
    email: string;
    code: string;
    password: string;
}


export interface LoginReq {
    name: string;
    email: string;
    password: string;
}