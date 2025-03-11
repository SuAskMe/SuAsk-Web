export interface QFMItem {
    id: number
    title: string
    contents: string
    views: number
    created_at: number
    image_urls: string[]
    is_pinned: boolean
    tag: string
}

export interface GetQFMReq {
    page: number
    sort_type: number
}

export interface SearchQFMReq {
    keyword: string
    page: number
    sort_type: number
}

export interface GetQFMRes {
    question_list: QFMItem[]
    remain_page: number
}

export interface GetQFMKeywordsReq {
    sort_type: number
    keyword: string
}

export interface GetQFMKeywordsRes {
    words: {
        value: string
    }[]
}

export interface PinQFMReq {
    question_id: number
}

export interface PinQFMRes {
    is_pinned: boolean
}
