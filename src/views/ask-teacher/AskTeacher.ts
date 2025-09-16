import { ElMessage } from 'element-plus'
import type { GetQuestionRes, QuestionItem } from '@/model/question.model'
import { favoriteApi } from '@/api/question/favorite.api'
import { getQuestionTeacherApi, searchQuestionTeacherApi } from '@/api/question/question.api'
import { usePagination, type PaginationParams } from '@/utils/pagination'

export const currentTeacherId: { value: number | null } = { value: null }

const pagination = usePagination<QuestionItem>({
    fetchData: async (params: PaginationParams) => {
        if (!currentTeacherId.value) {
            throw new Error('Teacher ID is not set')
        }
        
        let res: GetQuestionRes
        if (params.keyword) {
            res = await searchQuestionTeacherApi({
                teacher_id: currentTeacherId.value,
                keyword: params.keyword,
                sort_type: params.sort_type,
                page: params.page,
            })
        } else {
            res = await getQuestionTeacherApi({
                teacher_id: currentTeacherId.value,
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