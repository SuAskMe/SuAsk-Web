export interface SendCodeReq {
    email: string
    type: string
}

export interface SendCodeRes {
    code: string
}

export interface ResetPassword {
    email: string
    code: string
    password: string
}

export interface ForgetPassword {
    email: string
    code: string
    password: string
}
