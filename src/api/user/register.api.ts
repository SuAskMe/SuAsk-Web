import type { RegisterReq, SendVerificationCodeReq, VerifyVerificationCodeReq, VerifyVerificationCodeRes } from '@/model/register.model';
import request from '@/utils/http/request';


enum Api {
    SEND_VERIFICATION_CODE = '/register/send-verification-code',
    VERIFY_VERIFICATION_CODE = '/register/verify-verification-code',
    REGISTER = '/register',
}


export async function sendVerificationCodeApi(req: SendVerificationCodeReq) {
    return request.post(Api.SEND_VERIFICATION_CODE, req).then(res => {
        if (res) {
            return res.data;
        }
    })
}

export async function verifyVerificationCodeApi(req: VerifyVerificationCodeReq): Promise<VerifyVerificationCodeRes> {
    return await request.post(Api.VERIFY_VERIFICATION_CODE, req).then(res => {
        if (res) {
            return res.data;
        }
    });
}

export async function registerApi(req: RegisterReq) {
    return request.post(Api.REGISTER, req).then(res => {
        if (res) {
            return res.data;
        }
    });
}
