import { ElMessage } from 'element-plus'
import type { GetQuestionRes, QuestionItem } from '@/model/question.model'
import { favoriteApi } from '@/api/question/favorite.api'
import { getQuestionPublicApi, searchQuestionPublicApi } from '@/api/question/question.api'

let isEnd_aa = false
let currentPage_aa = 1
let sortType_aa = -1
let keyword_aa = ''
let alock_aa = false

export function InitStatus() {
    isEnd_aa = false
    currentPage_aa = 1
    sortType_aa = -1
    keyword_aa = ''
    alock_aa = false
}

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean,
): Promise<QuestionItem[]> {
    if (sortType_ !== undefined && sortType_ !== sortType_aa) {
        currentPage_aa = 1
        sortType_aa = sortType_
        isEnd_aa = false
    } else if (keyword_ !== undefined && keyword_ !== keyword_aa) {
        currentPage_aa = 1
        keyword_aa = keyword_
        isEnd_aa = false
    } else {
        currentPage_aa++
    }
    if (cancelSearch) {
        keyword_aa = ''
        currentPage_aa = 1
        isEnd_aa = false
    }
    if (isEnd_aa) {
        if (!alock_aa) {
            alock_aa = true
            ElMessage({ message: '没有更多了', type: 'success' })
        }
        setTimeout(() => {
            alock_aa = false
        }, 2000)
        return new Promise<QuestionItem[]>((resolve) => {
            resolve([])
        })
    }
    // console.log("getNextQuestions", sortType, currentPage);
    return getQuestionsByPage(sortType_aa, currentPage_aa, keyword_aa)
}

async function getQuestionsByPage(
    sortType: number,
    page: number,
    keyword: string,
): Promise<QuestionItem[]> {
    let res: GetQuestionRes
    if (keyword !== '') {
        res = await searchQuestionPublicApi({
            keyword: keyword,
            sort_type: sortType,
            page: page,
        })
    } else {
        res = await getQuestionPublicApi({
            sort_type: sortType,
            page: page,
        })
    }
    if (res.remain_page <= 0) {
        isEnd_aa = true
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
    } else {
        ElMessage.error('请求失败')
        return null
    }
}
