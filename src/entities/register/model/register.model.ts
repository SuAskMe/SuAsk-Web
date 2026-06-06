export interface RegisterReq {
    name: string
    password: string
    email: string
    code: string
}

export interface SendVerificationCodeReq {
    email: string
    name: string
}
