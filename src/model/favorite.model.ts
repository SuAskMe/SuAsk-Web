export interface GetFavoriteReq {
    sort_type: number
    page: number
}

export interface GetFavoriteRes {
    question_list: FavoriteItem[]
    remain_page: number
}

export interface FavoriteItem {
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

export interface GetFavoriteByKeywordReq {
    keyword: string
    page: number
}

export interface GetFavoriteByKeywordRes {
    words: Word[]
}

export interface Word {
    value: string
}

export interface SearchFavoriteReq {
    keyword?: string
    sort_type: number
    page: number
}

export interface SearchFavoriteRes {
    question_list: FavoriteItem[]
    remain_page: number
}

export interface FavoriteReq {
    question_id: number
}

export interface FavoriteRes {
    is_favorite: boolean
}
