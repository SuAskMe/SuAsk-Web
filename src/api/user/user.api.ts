import type { UpdateUser } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    UPDATE_PASSWORD = '/user/update-password',
    UPDATE_USER_INFO = '/user/update-user-info',
    GET_USER_INFO = '/user/info',
}

export async function updatePasswordApi(password: string) {
    return request.post(Api.UPDATE_PASSWORD, password);
}

export async function updateUserInfoApi(userInfo: UpdateUser) {
    return request.post(Api.UPDATE_USER_INFO, userInfo);
}

export async function getUserInfoApi() {
    return request.get(Api.GET_USER_INFO);
}

