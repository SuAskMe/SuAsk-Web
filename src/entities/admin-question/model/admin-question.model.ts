export type AdminQuestionStatus = 'answered' | 'unanswered'
export type AdminQuestionListStatus = 'all' | AdminQuestionStatus | 'deleted'
export type AdminDeletedStatus = 'deleted' | 'undeleted'
export type AdminDeletedStatusFilter = 'all' | AdminDeletedStatus
export type AdminQuestionVisibility = 'public' | 'private'

export interface AdminQuestionItem {
    id: number
    title: string
    contents: string
    src_user_id: number
    src_user_name: string
    src_user_nickname: string
    dst_user_id: number
    dst_user_name: string
    dst_user_nickname: string
    is_private: boolean
    created_at: number
    views: number
    reply_cnt: number
    answer_count: number
    matched_answer_count: number
    status: AdminQuestionStatus
    is_deleted: boolean
    deleted_at: number
}

export interface AdminQuestionListParams {
    page: number
    keyword?: string
    status?: AdminQuestionListStatus
    visibility?: '' | 'all' | AdminQuestionVisibility
    teacher_id?: number
}

export interface AdminQuestionListRes {
    list: AdminQuestionItem[]
    total: number
    remain_page: number
}

export interface AdminQuestionAnswerItem {
    id: number
    question_id: number
    user_id: number
    user_name: string
    user_nickname: string
    user_role: 'admin' | 'teacher' | 'student' | 'guest' | ''
    contents: string
    created_at: number
    upvotes: number
    in_reply_to: number
    is_deleted: boolean
    deleted_at: number
}

export interface AdminQuestionDetailRes {
    question: AdminQuestionItem
    answers: AdminQuestionAnswerItem[]
}

export interface AdminQuestionIdRes {
    id: number
}
