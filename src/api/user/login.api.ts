import request from "@/utils/http/request";

enum Api {
    LOGIN = '/user/login',
    LOGOUT = '/user/logout',
}

export function login(userName: string, password: string) {
    return request.post(Api.LOGIN, { userName, password });
}

export function logout() {
    return request.post(Api.LOGOUT);
}