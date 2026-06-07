import request from '@/shared/api/request'
import type {
    AdminDeletedStatusFilter,
    AdminQuestionDetailRes,
    AdminQuestionIdRes,
    AdminQuestionListParams,
    AdminQuestionListRes,
} from '../model/admin-question.model'

const QUESTIONS_API_PATH = '/admin/questions'

export async function getAdminQuestionList(
    params: AdminQuestionListParams,
): Promise<AdminQuestionListRes> {
    return request.get(QUESTIONS_API_PATH, { params }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function getAdminQuestionDetail(
    id: number,
    deletedStatus?: AdminDeletedStatusFilter,
): Promise<AdminQuestionDetailRes> {
    return request
        .get(`${QUESTIONS_API_PATH}/${id}`, { params: { deleted_status: deletedStatus } })
        .then((res) => {
            if (res) {
                return res.data
            }
        })
}

export async function deleteAdminQuestion(id: number): Promise<AdminQuestionIdRes> {
    return request.delete(`${QUESTIONS_API_PATH}/${id}`).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function restoreAdminQuestion(id: number): Promise<AdminQuestionIdRes> {
    return request.put(`${QUESTIONS_API_PATH}/${id}/restore`).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function deleteAdminQuestionAnswer(
    questionId: number,
    answerId: number,
): Promise<AdminQuestionIdRes> {
    return request.delete(`${QUESTIONS_API_PATH}/${questionId}/answers/${answerId}`).then((res) => {
        if (res) return res.data
    })
}

export async function restoreAdminQuestionAnswer(
    questionId: number,
    answerId: number,
): Promise<AdminQuestionIdRes> {
    return request.put(`${QUESTIONS_API_PATH}/${questionId}/answers/${answerId}/restore`).then((res) => {
        if (res) return res.data
    })
}
