import type { TeacherPinRes } from "@/model/teacher.model";
import request from "@/utils/http/request";

enum Api {
    GET_TEACHER = '/info/teacher',
    GET_TEACHER_PIN = '/info/teacher/pin'
}

export async function getTeacherApi() {
    return request.get(Api.GET_TEACHER).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function getTeacherPinApi(teacher_id: number): Promise<TeacherPinRes> {
    return request.get(Api.GET_TEACHER_PIN, { params: { teacher_id: teacher_id } }).then((res) => {
        if (res) {
            return res.data;
        }
    });
}