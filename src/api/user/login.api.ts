import request from "@/utils/http/request";

enum Api {
    LOGIN = '/user/login',
    LOGOUT = '/user/logout',
}

export async function loginApi(name: string, password: string) {
    return request.post(Api.LOGIN, { name, password });
}

export async function logoutApi() {
    return request.post(Api.LOGOUT);
}