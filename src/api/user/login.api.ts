import request from "@/utils/http/request";

enum Api {
    LOGIN = '/user/login',
    LOGOUT = '/user/logout',
}

export function login(name: string, password: string) {
    return request.post(Api.LOGIN, { name, password });
}

export function logout() {
    return request.post(Api.LOGOUT);
}