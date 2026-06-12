import type { TeacherPinRes } from '../model/teacher.model'
import request from '@/shared/api/request'

enum Api {
    GET_TEACHER = '/info/teacher',
    GET_TEACHER_PIN = '/info/teacher/pin',
    // 旧接口保留兼容，新版建议用 PUT /user 里的 question_box_perm 字段
    UPDATE_PERM = '/teacher/perm',
}

export async function getTeacherApi() {
    return request.get(Api.GET_TEACHER).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function getTeacherPinApi(teacher_id: number): Promise<TeacherPinRes> {
    return request.get(Api.GET_TEACHER_PIN, { params: { teacher_id: teacher_id } }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function updateTeacherPermApi(perm: string) {
    return request.put(Api.UPDATE_PERM, { perm }).then((res) => {
        if (res) {
            return res.data
        }
    })
}
