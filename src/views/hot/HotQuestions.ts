import type { GetQuestionRes, QuestionItem } from '@/model/question.model'
import { getHotQuestionsApi, type GetHotQuestionsReq } from '@/api/question/hot.api'
import { usePagination, type PaginationParams } from '@/utils/pagination'
import { ref } from 'vue'

export const currentTimeRange = ref<'week' | 'month' | 'all'>('week')

const pagination = usePagination<QuestionItem>({
    fetchData: async (params: PaginationParams) => {
        const req: GetHotQuestionsReq = {
            page: params.page,
            time_range: currentTimeRange.value,
            keyword: params.keyword || undefined,
        }
        const res: GetQuestionRes = await getHotQuestionsApi(req)
        return res
    },
    // 热点默认按浏览量排序，sort_type 不影响后端（后端固定按 views 排）
    initialSortType: 0,
})

const {
    data: questionList,
    init: InitStatus,
    loadMore: getNextQuestions,
    search: onSearch,
    cancelSearch: onCancelSearch,
    refresh,
} = pagination

export { questionList, InitStatus, getNextQuestions, onSearch, onCancelSearch, refresh }
