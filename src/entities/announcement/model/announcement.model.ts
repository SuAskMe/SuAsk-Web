export interface AnnouncementImage {
    id: number
    url: string
}

export interface AnnouncementItem {
    id: number
    title: string
    contents: string
    author_name: string
    is_pinned: boolean
    published_at: number
    expires_at: number
    comment_cnt: number
    image_urls: string[]
}

export interface AnnouncementListRes {
    announcements: AnnouncementItem[]
    remain_page: number
    total: number
}

export interface AnnouncementDetailRes {
    id: number
    title: string
    contents: string
    author_name: string
    is_pinned: boolean
    published_at: number
    expires_at: number
    image_urls: string[]
    images: AnnouncementImage[]
    comments: Array<{
        id: number
        user_id: number
        nickname: string
        avatar: string
        contents: string
        created_at: number
        in_reply_to: number
    }>
}

export interface ActiveAnnouncementItem {
    id: number
    title: string
    contents: string
    author_name: string
    is_pinned: boolean
    published_at: number
    expires_at: number
    image_urls: string[]
}

export interface ActiveAnnouncementRes {
    announcement: ActiveAnnouncementItem | null
}

export interface CreateAnnouncementReq {
    title: string
    content: string
    is_pinned: boolean
    expires_at: string
}

export interface UpdateAnnouncementReq {
    id: number
    title: string
    content: string
    is_pinned: boolean
    expires_at: string
}
