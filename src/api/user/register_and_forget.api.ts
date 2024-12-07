import type { RegisterForm } from '@/model/user.model';
import request from '@/utils/http/request';


enum Api {
    SEND_VERIFICATION_CODE = '/user/send-verification-code',
    VERIFY_VERIFICATION_CODE = '/user/verify-verification-code',
    REGISTER = '/user/register',
}


export async function sendVerificationCodeApi(email: string) {
    return request.post(Api.SEND_VERIFICATION_CODE, email);
}

export async function verifyVerificationCodeApi(email: string, verificationCode: string) {
    return request.post(Api.VERIFY_VERIFICATION_CODE, { email, verificationCode });
}

export async function registerApi(registerForm: RegisterForm) {
    return request.post(Api.REGISTER, registerForm);
}
