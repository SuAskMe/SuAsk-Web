import type { GetQuestionByKeywordReq, GetQuestionByKeywordRes, GetQuestionReq, GetQuestionRes, SearchQuestionReq, SearchQuestionRes } from "@/model/question.model";
import request from "@/utils/http/request";

enum Api {
    ADD = '/questions/add',
    GET_QUESTION_PUBLIC = '/questions/public',
    GET_QUESTION_PUBLIC_BY_KEYWORD = '/questions/public/keywords',
    SEARCH_QUESTION_PUBLIC = '/questions/public/search',

    GET_QUESTION_TEACHER = '/questions/teacher',
    GET_QUESTION_TEACHER_BY_KEYWORD = '/questions/teacher/keywords',
    SEARCH_QUESTION_TEACHER = '/questions/teacher/search',
}

// 添加问题
export async function addQuestionApi(question: FormData) {
    return request.post(Api.ADD, question);
}

// 获取问题列表
export async function getQuestionPublicApi(req: GetQuestionReq): Promise<GetQuestionRes> {
    return request.get(Api.GET_QUESTION_PUBLIC, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function getQuestionTeacherApi(req: GetQuestionReq): Promise<GetQuestionRes> {
    return request.get(Api.GET_QUESTION_TEACHER, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

// 获取问题关键词
export async function getQuestionPublicByKeywordApi(req: GetQuestionByKeywordReq): Promise<GetQuestionByKeywordRes> {
    return request.get(Api.GET_QUESTION_PUBLIC_BY_KEYWORD, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function getQuestionTeacherByKeywordApi(req: GetQuestionByKeywordReq): Promise<GetQuestionByKeywordRes> {
    return request.get(Api.GET_QUESTION_TEACHER_BY_KEYWORD, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

// 搜索问题
export async function searchQuestionPublicApi(req: SearchQuestionReq): Promise<SearchQuestionRes> {
    return request.get(Api.SEARCH_QUESTION_PUBLIC, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function searchQuestionTeacherApi(req: SearchQuestionReq): Promise<SearchQuestionRes> {
    return request.get(Api.SEARCH_QUESTION_TEACHER, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}