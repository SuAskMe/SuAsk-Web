import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { favoriteApi } from '@/entities/favorite'
import { getHistoryApi, searchHistoryApi, type GetHistoryRes, type HistoryItem } from '@/entities/history'
import { usePagination, type PaginationParams } from '@/shared/lib/pagination'

const {
    data: questionList,
    init: InitStatus,
    loadMore: getNextQuestions,
    search: onSearch,
    cancelSearch: onCancelSearch,
    refresh,
} = usePagination<HistoryItem>({
    fetchData: async (params: PaginationParams) => {
        let res: GetHistoryRes
        if (params.keyword) {
            res = await searchHistoryApi({
                keyword: params.keyword,
                sort_type: params.sort_type,
                page: params.page,
            })
        } else {
            res = await getHistoryApi({
                sort_type: params.sort_type,
                page: params.page,
            })
        }
        return res
    },
    initialPage: 0,
})

export { questionList, InitStatus, getNextQuestions, onSearch, onCancelSearch, refresh }

export async function Favorite(question_id: number): Promise<boolean | null> {
    const res = await favoriteApi({ question_id })
    if (res) {
        return res.is_favorite
    }
    ElMessage.error('请求失败')
    return null
}
