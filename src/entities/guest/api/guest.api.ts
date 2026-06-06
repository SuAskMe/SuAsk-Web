import type { LoginRes } from '@/entities/session'
import type { GuestSendCodeReq, GuestSendCodeRes, GuestUpgradeReq } from '../model/guest.model'
import request from '@/utils/http/request'

enum Api {
    GUEST_LOGIN = '/guest/login',
    GUEST_UPGRADE = '/guest/upgrade',
    GUEST_SEND_CODE = '/guest/send-code',
}

export async function guestLoginApi(): Promise<LoginRes> {
    return request.post(Api.GUEST_LOGIN).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function guestUpgradeApi(req: GuestUpgradeReq): Promise<LoginRes> {
    return request.post(Api.GUEST_UPGRADE, req).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function guestSendCodeApi(req: GuestSendCodeReq): Promise<GuestSendCodeRes> {
    return request.post(Api.GUEST_SEND_CODE, req).then((res) => {
        if (res) {
            return res.data
        }
    })
}
