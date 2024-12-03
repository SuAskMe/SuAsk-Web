import type { RegisterForm } from '@/model/user.model';
import request from '@/utils/http/request';


enum Api {
    SEND_VERIFICATION_CODE = '/user/send-verification-code',
    VERIFY_VERIFICATION_CODE = '/user/verify-verification-code',
    REGISTER = '/user/register',
}


export function sendVerificationCode(email: string) {
    return request.post(Api.SEND_VERIFICATION_CODE, email);
}

export function verifyVerificationCode(email: string, verificationCode: string) {
    return request.post(Api.VERIFY_VERIFICATION_CODE, { email, verificationCode });
}

export function register(registerForm: RegisterForm) {
    return request.post(Api.REGISTER, registerForm);
}
