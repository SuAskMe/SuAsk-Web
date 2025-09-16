import { favoriteApi } from '@/api/question/favorite.api'
import { searchHistoryApi, getHistoryApi } from '@/api/question/history.api'
import type { HistoryItem, GetHistoryRes } from '@/model/history.model'
import { ElMessage } from 'element-plus'

let isEnd_ah = false
let currentPage_ah = 1
let sortType_ah = -1
let keyword_ah = ''
let alock_ah = false

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean,
): Promise<HistoryItem[]> {
    if (sortType_ !== undefined && sortType_ !== sortType_ah) {
        currentPage_ah = 1
        sortType_ah = sortType_
        isEnd_ah = false
    } else if (keyword_ !== undefined && keyword_ !== keyword_ah) {
        currentPage_ah = 1
        keyword_ah = keyword_
        isEnd_ah = false
    } else {
        currentPage_ah++
    }
    if (cancelSearch) {
        keyword_ah = ''
        currentPage_ah = 1
        isEnd_ah = false
    }
    if (isEnd_ah) {
        if (!alock_ah) {
            alock_ah = true
            ElMessage.success('没有更多了')
        }
        setTimeout(() => {
            alock_ah = false
        }, 2000)
        return new Promise<HistoryItem[]>((resolve) => {
            resolve([])
        })
    }
    return await getQuestionsByPage(sortType_ah, currentPage_ah, keyword_ah)
}

async function getQuestionsByPage(
    sortType: number,
    page: number,
    keyword: string,
): Promise<HistoryItem[]> {
    let res: GetHistoryRes
    if (keyword !== '') {
        res = await searchHistoryApi({
            keyword,
            sort_type: sortType,
            page: page,
        })
    } else {
        res = await getHistoryApi({ sort_type: sortType, page: page })
    }
    if (res.remain_page <= 0) {
        isEnd_ah = true
    }
    if (res.question_list) {
        return res.question_list
    } else {
        return []
    }
}

export async function Favorite(question_id: number): Promise<boolean | null> {
    const res = await favoriteApi({ question_id })
    if (res) {
        return res.is_favorite
    }
    ElMessage.error('请求失败')
    return null
}
