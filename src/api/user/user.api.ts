import type { User, UserInfo } from "@/model/user.model";
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

export async function updateUserInfoApi(userInfo: FormData) {
    return request.put(Api.UPDATE_USER_INFO, userInfo).then((res) => {
        if (res) {
            return res.data
        }
    });
}

export async function getUserInfoApi(): Promise<User> {
    return request.get(Api.GET_USER_INFO).then((res) => {
        if (res) {
            return res.data
        }
    });
}

export async function getUserByIdApi(id: string): Promise<UserInfo> {
    return request.get(Api.GET_USER_BY_ID, { params: { id } }).then((res) => {
        if (res) {
            return res.data
        }
    });
}
