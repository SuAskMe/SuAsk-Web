export interface GuestUpgradeReq {
    name: string
    email: string
    password: string
    code: string
}

export interface GuestSendCodeReq {
    name: string
    email: string
}

export interface GuestSendCodeRes {
    msg: string
}
