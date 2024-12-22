import request from "@/utils/http/request";

enum Api {
    GET_TEACHER = '/teacher'
}

export async function getTeacherApi() {
    return request.get(Api.GET_TEACHER);
}