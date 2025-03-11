import { ElMessage } from 'element-plus'
import { favoriteApi, getFavoriteApi, searchFavoriteApi } from '@/api/question/favorite.api'
import type { FavoriteItem, FavoriteRes, GetFavoriteRes } from '@/model/favorite.model'

let isEnd_mf = false
let currentPage_mf = 1
let sortType_mf = -1
let keyword_mf = ''
let alock_mf = false

export function InitStatus() {
    isEnd_mf = false
    currentPage_mf = 1
    sortType_mf = -1
    keyword_mf = ''
    alock_mf = false
}

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean,
): Promise<FavoriteItem[]> {
    if (sortType_ !== undefined && sortType_ !== sortType_mf) {
        currentPage_mf = 1
        sortType_mf = sortType_
        isEnd_mf = false
    } else if (keyword_ !== undefined && keyword_ !== keyword_mf) {
        currentPage_mf = 1
        keyword_mf = keyword_
        isEnd_mf = false
    } else {
        currentPage_mf++
    }
    if (cancelSearch) {
        keyword_mf = ''
        currentPage_mf = 1
        isEnd_mf = false
    }
    if (isEnd_mf) {
        if (!alock_mf) {
            alock_mf = true
            ElMessage.success('没有更多了')
        }
        setTimeout(() => {
            alock_mf = false
        }, 2000)
        return new Promise<FavoriteItem[]>((resolve) => {
            resolve([])
        })
    }
    return await getQuestionsByPage(sortType_mf, currentPage_mf, keyword_mf)
}

async function getQuestionsByPage(
    sortType: number,
    page: number,
    keyword: string,
): Promise<FavoriteItem[]> {
    var res: GetFavoriteRes
    if (keyword !== '') {
        res = await searchFavoriteApi({
            keyword,
            sort_type: sortType,
            page: page,
        })
    } else {
        res = await getFavoriteApi({ sort_type: sortType, page: page })
    }
    if (res.remain_page <= 0) {
        isEnd_mf = true
    }
    if (res.favorite_list) {
        return res.favorite_list
    } else {
        return []
    }
}

export async function Favorite(question_id: number): Promise<FavoriteRes | null> {
    var res = await favoriteApi({ question_id })
    if (res) {
        return res
    }
    ElMessage.error('请求失败')
    return null
}
