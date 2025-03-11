export interface TeacherItem {
    id: number
    responses: number
    name: string
    avatarUrl: string
    introduction: string
    email: string
    perm: string
    value: string
}

export interface TeacherPinItem {
    id: number
    title: string
    contents: string
    views: number
    created_at: number
    image_urls: string[]
}

export interface TeacherPinRes {
    question_list: TeacherPinItem[]
}

export enum TeacherPerm {
    Private = 'private',
    Public = 'public',
    Protected = 'protected',
}
