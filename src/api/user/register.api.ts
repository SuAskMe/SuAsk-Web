import type { RegisterForm } from '@/model/user.model';
import request from '@/utils/http/request';


enum Api {
    SEND_VERIFICATION_CODE = '/register/send-verification-code',
    VERIFY_VERIFICATION_CODE = '/register/verify-verification-code',
    REGISTER = '/register',
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
