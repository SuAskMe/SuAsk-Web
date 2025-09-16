import { ElMessage } from 'element-plus'
import type { GetQFMRes, QFMItem } from '@/model/teacher-self.model'
import {
    getQFMAnsweredApi,
    getQFMOnTopApi,
    getQFMUnansweredApi,
    pinQFMApi,
} from '@/api/question/teacher-self.api'
import { usePagination, type PaginationParams } from '@/utils/pagination'

let Api = getQFMAnsweredApi

function setAnsweredOrNot(type: string): void {
    switch (type) {
        case 'answered':
            Api = getQFMAnsweredApi
            break
        case 'unanswered':
            Api = getQFMUnansweredApi
            break
        case 'top':
            Api = getQFMOnTopApi
            break
    }
}

const {
    data: questionList,
    init: InitStatus,
    loadMore: getNextQuestions,
    refresh,
} = usePagination<QFMItem>({
    fetchData: async (params: PaginationParams) => {
        const res: GetQFMRes = await Api({
            sort_type: params.sort_type,
            page: params.page,
        })
        return res
    },
})

// 为InitStatus添加type参数以适配原有接口
const InitStatusWithType = (type: string) => {
    setAnsweredOrNot(type)
    InitStatus()
}

export {
    questionList,
    InitStatusWithType as InitStatus,
    getNextQuestions,
    refresh,
    setAnsweredOrNot,
}

export async function Pin(question_id: number): Promise<boolean | null> {
    const res = await pinQFMApi({ question_id })
    if (res) {
        return res.is_pinned
    } else {
        ElMessage.error('请求失败')
        return null
    }
}
