import type { ResetPassword, CheckOldPassword } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    RESET_PASSWORD = '/user/password',
    CHECK_OLD_PASSWORD = '/user/check-old-password',
}

export async function resetPasswordApi(resetPasswordForm: ResetPassword) {
    return request.post(Api.RESET_PASSWORD, resetPasswordForm);
}

export async function checkOldPasswordApi(checkOldPasswordForm: CheckOldPassword) {
    return request.post(Api.CHECK_OLD_PASSWORD, checkOldPasswordForm);
}