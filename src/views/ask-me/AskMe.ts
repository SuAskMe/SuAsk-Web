import { ElMessage } from 'element-plus'
import type { GetQFMRes, QFMItem } from '@/model/teacher-self.model'
import { getQFMAllApi, pinQFMApi, searchQFMApi } from '@/api/question/teacher-self.api'
import { usePagination, type PaginationParams } from '@/utils/pagination'

const {
    data: questionList,
    init: InitStatus,
    loadMore: getNextQuestions,
    search: onSearch,
    cancelSearch: onCancelSearch,
    refresh,
} = usePagination<QFMItem>({
    fetchData: async (params: PaginationParams) => {
        let res: GetQFMRes
        if (params.keyword) {
            res = await searchQFMApi({
                keyword: params.keyword,
                sort_type: params.sort_type,
                page: params.page,
            })
        } else {
            res = await getQFMAllApi({
                sort_type: params.sort_type,
                page: params.page,
            })
        }
        return res
    },
})

export { questionList, InitStatus, getNextQuestions, onSearch, onCancelSearch, refresh }

export async function Pin(question_id: number): Promise<boolean | null> {
    const res = await pinQFMApi({ question_id })
    if (res) {
        return res.is_pinned
    } else {
        ElMessage.error('请求失败')
        return null
    }
}
