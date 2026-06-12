import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import {
    favoriteApi,
    getFavoriteApi,
    searchFavoriteApi,
    type FavoriteItem,
    type GetFavoriteRes,
} from '@/entities/favorite'
import { usePagination, type PaginationParams } from '@/shared/lib/pagination'

const pagination = usePagination<FavoriteItem>({
    fetchData: async (params: PaginationParams) => {
        let res: GetFavoriteRes
        if (params.keyword) {
            res = await searchFavoriteApi({
                keyword: params.keyword,
                sort_type: params.sort_type,
                page: params.page,
            })
        } else {
            res = await getFavoriteApi({
                sort_type: params.sort_type,
                page: params.page,
            })
        }
        return res
    },
})

const { data: questionList, init: InitStatus, loadMore: getNextQuestions, refresh } = pagination

export { questionList, InitStatus, getNextQuestions, refresh }

export async function Favorite(question_id: number) {
    const res = await favoriteApi({ question_id })
    if (res) {
        return res
    }
    ElMessage.error('请求失败')
    return null
}
