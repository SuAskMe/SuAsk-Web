import type { LoginReq } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    LOGIN = '/login',
    LOGOUT = '/user/logout',
}

export async function loginApi(loginForm: LoginReq) {
    return request.post(Api.LOGIN, loginForm);
}

export async function logoutApi() {
    return request.post(Api.LOGOUT).then((res) => {
        if (res) {
            return res.data;
        }
    });
}