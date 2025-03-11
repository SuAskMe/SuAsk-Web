export interface GetHistoryReq {
    sort_type: number
    page: number
}

export interface GetHistoryRes {
    favorite_list: HistoryItem[]
    remain_page: number
}

export interface HistoryItem {
    id: number
    title: string
    contents: string
    views: number
    created_at: number
    image_urls: string[]
    is_favorite: boolean
    answer_num: number
    answer_avatars: string[]
}

export interface GetHistoryByKeywordReq {
    keyword: string
    page: number
}

export interface GetHistoryByKeywordRes {
    words: Word[]
}

export interface Word {
    value: string
}

export interface SearchHistoryReq {
    keyword?: string
    sort_type: number
    page: number
}

export interface SearchHistoryRes {
    favorite_list: HistoryItem[]
    remain_page: number
}

export interface HistoryReq {
    question_id: number
}

export interface HistoryRes {
    is_favorite: boolean
}
