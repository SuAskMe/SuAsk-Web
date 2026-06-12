import type { GetQuestionRes } from '../model/question.model'
import request from '@/shared/api/request'

export interface GetHotQuestionsReq {
    page: number
    time_range: 'week' | 'month' | 'all'
    keyword?: string
}

export async function getHotQuestionsApi(req: GetHotQuestionsReq): Promise<GetQuestionRes> {
    return request.get('/questions/hot', { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}
