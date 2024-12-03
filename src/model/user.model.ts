enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}

export interface RegisterForm {
    userName: string,
    password: string,
    role: Role,
    token: string, // 搭载 Email 和过期时间
}

export interface ForgetPasswordForm {
    email: string;
    password: string;
}

export interface User {
    id: number;
    userName: string;
    email: string;
    role: Role;
    nickName: string;
    introduction: string;
}