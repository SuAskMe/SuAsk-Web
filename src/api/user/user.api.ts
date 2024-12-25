import type { UpdateAvatar, UpdateUser } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    UPDATE_PASSWORD = '/user/password',
    UPDATE_USER_INFO = '/user',
    GET_USER_INFO = '/user',
    GET_USER_BY_ID = '/info/user',
}

export async function updatePasswordApi(password: string) {
    return request.post(Api.UPDATE_PASSWORD, password);
}

export async function updateUserInfoApi(userInfo: UpdateUser | UpdateAvatar) {
    return request.put(Api.UPDATE_USER_INFO, userInfo);
}

export async function getUserInfoApi() {
    return request.get(Api.GET_USER_INFO);
}

export async function getUserByIdApi(id: string) {
    return request.get(Api.GET_USER_BY_ID, { params: { id } });
}
