import type { UpvoteAnswerReq } from '@/model/answer.model'
import request from '@/utils/http/request'

enum Api {
    GET = '/answer',
    ADD = '/answer/add',
    UPVOTE = '/answer/upvote',
}

export async function getAnswerApi(question_id: number) {
    return request.get(Api.GET, { params: { question_id } })
}

export async function addAnswerApi(answer: FormData) {
    return request.post(Api.ADD, answer)
}

export async function upvoteAnswerApi(answer: UpvoteAnswerReq) {
    return request.post(Api.UPVOTE, answer)
}
