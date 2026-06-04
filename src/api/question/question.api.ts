import type {
    GetKeywordReq,
    GetKeywordRes,
    GetQuestionReq,
    GetQuestionRes,
    SearchQuestionReq,
    SearchQuestionRes,
} from '@/model/question.model'
import request from '@/utils/http/request'

enum Api {
    ADD = '/questions/add',
    DELETE = '/questions',

    GET_QUESTION_TEACHER = '/questions/teacher',
    GET_QUESTION_TEACHER_BY_KEYWORD = '/questions/teacher/keywords',
    SEARCH_QUESTION_TEACHER = '/questions/teacher/search',
}

// 添加问题
export async function addQuestionApi(question: FormData) {
    return request.post(Api.ADD, question)
}

// 删除问题
export async function deleteQuestionApi(id: number) {
    return request.delete(Api.DELETE, { data: { id } })
}

// 恢复问题
export async function restoreQuestionApi(id: number) {
    return request.post(`${Api.DELETE}/restore`, { id })
}

// 获取老师问题列表
export async function getQuestionTeacherApi(req: GetQuestionReq): Promise<GetQuestionRes> {
    return request.get(Api.GET_QUESTION_TEACHER, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

// 获取问题关键字（老师问题）
export async function getQuestionKeywordApi(req: GetKeywordReq): Promise<GetKeywordRes> {
    return request.get(Api.GET_QUESTION_TEACHER_BY_KEYWORD, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

// 搜索问题（老师问题）
export async function searchQuestionTeacherApi(req: SearchQuestionReq): Promise<SearchQuestionRes> {
    return request.get(Api.SEARCH_QUESTION_TEACHER, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}
