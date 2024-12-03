import type { User } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    UPDATE_PASSWORD = '/user/update-password',
    UPDATE_USER_INFO = '/user/update-user-info',
}

export function updatePassword(password: string) {
    return request.post(Api.UPDATE_PASSWORD, password);
}

export function updateUserInfo(userInfo: User) {
    return request.post(Api.UPDATE_USER_INFO, userInfo);
}

