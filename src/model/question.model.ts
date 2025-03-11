export interface AddQuestionReq {
    dst_user_id: number | null
    title: string
    content: string
    is_private: boolean
}

export interface Teacher {
    teacherId: number
    teacherName: string
}

export interface QuestionItem {
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

export interface GetQuestionReq {
    teacher_id?: number
    sort_type: number
    page: number
}

export interface GetQuestionRes {
    question_list: QuestionItem[]
    remain_page: number
}

export interface GetKeywordReq {
    teacher_id?: number
    keyword: string
    sort_type: number
}

export interface GetKeywordRes {
    words: Word[]
}

export interface Word {
    value: string
}

export interface SearchQuestionReq {
    teacher_id?: number
    keyword?: string
    sort_type: number
    page: number
}

export interface SearchQuestionRes {
    question_list: QuestionItem[]
    remain_page: number
}
