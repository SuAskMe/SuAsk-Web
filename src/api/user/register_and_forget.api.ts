import type { RegisterForm } from '@/model/user.model';
import request from '@/utils/http/request';


enum Api {
    SEND_VERIFICATION_CODE = '/user/send-verification-code',
    VERIFY_VERIFICATION_CODE = '/user/verify-verification-code',
    REGISTER = '/user/register',
}


export async function sendVerificationCodeApi(email: string, name: string) {
    return request.post(Api.SEND_VERIFICATION_CODE, { email, name });
}

export async function verifyVerificationCodeApi(email: string, code: string) {
    return request.post(Api.VERIFY_VERIFICATION_CODE, { email, code });
}

export async function registerApi(registerForm: RegisterForm) {
    return request.post(Api.REGISTER, registerForm);
}
