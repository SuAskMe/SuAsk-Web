import request from '@/shared/api/request'
import type {
    AnnouncementListRes,
    AnnouncementDetailRes,
    ActiveAnnouncementRes,
} from '../model/announcement.model'

enum Api {
    ACTIVE = '/announcements/active',
    LIST = '/announcements',
    ADMIN_LIST = '/announcements/admin',
    DETAIL = '/announcements/detail',
    COMMENT = '/announcements/comment',
}

export async function getActiveAnnouncement(): Promise<ActiveAnnouncementRes> {
    return request.get(Api.ACTIVE).then((res) => {
        if (res) return res.data
    })
}

export async function getAnnouncementList(page: number): Promise<AnnouncementListRes> {
    return request.get(Api.LIST, { params: { page } }).then((res) => {
        if (res) return res.data
    })
}

export async function getAdminAnnouncementList(page: number): Promise<AnnouncementListRes> {
    return request.get(Api.ADMIN_LIST, { params: { page } }).then((res) => {
        if (res) return res.data
    })
}

export async function getAnnouncementDetail(id: number): Promise<AnnouncementDetailRes> {
    return request.get(Api.DETAIL, { params: { id } }).then((res) => {
        if (res) return res.data
    })
}

export async function createAnnouncement(data: FormData): Promise<{ id: number }> {
    return request.post(Api.LIST, data).then((res) => {
        if (res) return res.data
    })
}

export async function updateAnnouncement(data: FormData): Promise<{ id: number }> {
    return request.put(Api.LIST, data).then((res) => {
        if (res) return res.data
    })
}

export async function deleteAnnouncement(id: number): Promise<void> {
    return request.delete(Api.LIST, { data: { id } }).then((res) => {
        if (res) return res.data
    })
}
