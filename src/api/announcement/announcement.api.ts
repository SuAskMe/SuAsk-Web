import request from '@/utils/http/request'
import type {
    AnnouncementListRes,
    AnnouncementDetailRes,
    ActiveAnnouncementRes,
    CreateAnnouncementReq,
    UpdateAnnouncementReq,
} from '@/model/announcement.model'

enum Api {
    ACTIVE = '/announcements/active',
    LIST = '/announcements',
    DETAIL = '/announcements/detail',
    COMMENT = '/announcements/comment',
}

/** 获取当前活跃公告（Banner） */
export async function getActiveAnnouncement(): Promise<ActiveAnnouncementRes> {
    return request.get(Api.ACTIVE).then((res) => {
        if (res) return res.data
    })
}

/** 获取公告列表 */
export async function getAnnouncementList(page: number): Promise<AnnouncementListRes> {
    return request.get(Api.LIST, { params: { page } }).then((res) => {
        if (res) return res.data
    })
}

/** 获取公告详情 */
export async function getAnnouncementDetail(id: number): Promise<AnnouncementDetailRes> {
    return request.get(Api.DETAIL, { params: { id } }).then((res) => {
        if (res) return res.data
    })
}

/** 创建公告 */
export async function createAnnouncement(data: CreateAnnouncementReq): Promise<{ id: number }> {
    return request.post(Api.LIST, data).then((res) => {
        if (res) return res.data
    })
}

/** 更新公告 */
export async function updateAnnouncement(data: UpdateAnnouncementReq): Promise<{ id: number }> {
    return request.put(Api.LIST, data).then((res) => {
        if (res) return res.data
    })
}

/** 删除公告 */
export async function deleteAnnouncement(id: number): Promise<void> {
    return request.delete(Api.LIST, { data: { id } }).then((res) => {
        if (res) return res.data
    })
}
