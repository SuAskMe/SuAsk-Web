import type { LoginReq, LoginRes } from "@/model/user.model";
import request from "@/utils/http/request";

enum Api {
    LOGIN = '/login',
    LOGOUT = '/user/logout',
}

export async function loginApi(req: LoginReq): Promise<LoginRes> {
    return request.post(Api.LOGIN, req).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function logoutApi() {
    return request.post(Api.LOGOUT).then((res) => {
        if (res) {
            return res.data;
        }
    });
}