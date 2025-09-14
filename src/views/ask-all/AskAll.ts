import { ElMessage } from 'element-plus'
import type { GetQuestionRes, QuestionItem } from '@/model/question.model'
import { favoriteApi } from '@/api/question/favorite.api'
import { getQuestionPublicApi, searchQuestionPublicApi } from '@/api/question/question.api'
import { usePagination, type PaginationParams } from '@/utils/pagination'

const pagination = usePagination<QuestionItem>({
    fetchData: async (params: PaginationParams) => {
        let res: GetQuestionRes
        if (params.keyword) {
            res = await searchQuestionPublicApi({
                keyword: params.keyword,
                sort_type: params.sort_type,
                page: params.page,
            })
        } else {
            res = await getQuestionPublicApi({
                sort_type: params.sort_type,
                page: params.page,
            })
        }
        return res
    },
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

export async function Favorite(question_id: number): Promise<boolean | null> {
    const res = await favoriteApi({ question_id })
    if (res) {
        return res.is_favorite
    } else {
        ElMessage.error('请求失败')
        return null
    }
}
