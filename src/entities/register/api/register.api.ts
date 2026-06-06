import type { RegisterReq, SendVerificationCodeReq } from '../model/register.model'
import request from '@/utils/http/request'

enum Api {
    SEND_VERIFICATION_CODE = '/register/send-verification-code',
    REGISTER = '/register',
}

export async function sendVerificationCodeApi(req: SendVerificationCodeReq) {
    return request.post(Api.SEND_VERIFICATION_CODE, req).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function registerApi(req: RegisterReq) {
    return request.post(Api.REGISTER, req).then((res) => {
        if (res) {
            return res.data
        }
    })
}
