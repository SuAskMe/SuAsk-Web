import type {
    UpdateNotificationRes,
    Notification,
    NotificationCountRes,
} from '../model/notification.model'
import request from '@/shared/api/request'

enum Api {
    NOTIFICATION = 'notification',
    NOTIFICATION_COUNT = 'notification/count',
}

export async function getNotificationApi(user_id: number): Promise<Notification | null> {
    return await request.get(Api.NOTIFICATION, { params: { user_id: user_id } }).then((res) => {
        if (res) {
            return res.data ?? null
        }
        return null
    })
}

export async function readNotificationApi(id: number): Promise<UpdateNotificationRes | null> {
    return await request.put(Api.NOTIFICATION, { id }).then((res) => {
        if (res) {
            return res.data ?? null
        }
        return null
    })
}

export async function deleteNotificationApi(id: number): Promise<boolean> {
    return await request.delete(Api.NOTIFICATION, { params: { id } }).then((res) => Boolean(res))
}

export async function getNotificationCountApi(user_id: number): Promise<NotificationCountRes | null> {
    return await request
        .get(Api.NOTIFICATION_COUNT, { params: { user_id: user_id } })
        .then((res) => {
            if (res) {
                return res.data ?? null
            }
            return null
        })
}
