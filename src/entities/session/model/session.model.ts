export interface LoginReq {
    name: string
    email: string
    password: string
}

export interface LoginRes {
    id: number
    role: string
}

export interface HeartbeatRes {
    id: number
}
