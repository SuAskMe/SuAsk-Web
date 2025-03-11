export interface RegisterReq {
    name: string
    password: string
    email: string
    token: string
}

// export interface RegisterRes {
//     id: number;
// }

export interface SendVerificationCodeReq {
    email: string
    name: string
}

export interface VerifyVerificationCodeReq {
    email: string
    code: string
}

export interface VerifyVerificationCodeRes {
    token: string
}
