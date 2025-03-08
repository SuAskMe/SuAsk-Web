import type { ForgetPassword, ResetPassword, SendCodeReq } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    FORGET_PASSWORD = '/user/forget-password',
    RESET_PASSWORD = '/user/password',
    SEND_CODE = '/user/send-code'
}

export async function sendCodeApi(req: SendCodeReq) {
    return request.post(Api.SEND_CODE, req).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function resetPasswordApi(req: ResetPassword) {
    return request.put(Api.RESET_PASSWORD, req).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function forgetPasswordApi(req: ForgetPassword) {
    return request.post(Api.FORGET_PASSWORD, req).then((res) => {
        if (res) {
            return res.data;
        }
    });
}