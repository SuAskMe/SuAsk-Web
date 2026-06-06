import { heartbeatApi, loginApi, logoutApi, type LoginReq } from '@/entities/session'
import { guestLoginApi } from '@/api/guest/guest.api'
import { getUserInfoApi, Role, type User } from '@/entities/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pinia } from '..'

export const UserStore = defineStore(
    'user',
    () => {
        const userInfo = ref<User | null>(null)
        const token = ref<string | null>(null)

        function getUser(): User {
            return userInfo.value || ({} as User)
        }

        function getToken(): string {
            return token.value || ''
        }

        function getRole(): string {
            return userInfo.value?.role || ''
        }

        function setToken(_token: string) {
            token.value = _token
        }

        function setUser(user: User) {
            userInfo.value = user
        }

        // function setRole(_role: string) {
        //     role.value = _role
        // }

        function resetState() {
            userInfo.value = null
            token.value = ''
        }

        async function login(req: LoginReq): Promise<User | null> {
            try {
                const res = await loginApi(req)
                if (!res) {
                    return null
                }
                setToken(res.token)
                // setRole(res.role)
                const user = await getUserInfo()
                return user
            } catch {
                return null
            }
        }

        async function autoLogin(): Promise<User | null> {
            try {
                const res = await heartbeatApi()
                if (res && res.id === userInfo.value?.id) {
                    // 心跳成功，获取用户信息
                    const user = await getUserInfo()
                    return user
                }
                return null
            } catch {
                return null
            }
        }

        async function getUserInfo(): Promise<User | null> {
            const user = await getUserInfoApi()
            if (!user) {
                return null
            }
            setUser(user)
            return user
        }

        async function guestLogin(): Promise<User | null> {
            const res = await guestLoginApi()
            if (!res) {
                return null
            }
            setToken(res.token)
            const user = await getUserInfo()
            return user
        }

        function isGuest(): boolean {
            return userInfo.value?.role === Role.GUEST
        }

        async function logout(): Promise<unknown> {
            if (getToken()) {
                const res = await logoutApi()
                if (res) {
                    resetState()
                    return res
                } else {
                    return Promise.reject(res)
                }
            }
        }

        return {
            userInfo,
            token,
            // role,
            getUser,
            getToken,
            getRole,
            setToken,
            setUser,
            resetState,
            login,
            autoLogin,
            getUserInfo,
            guestLogin,
            isGuest,
            logout,
        }
    },
    {
        persist: true,
    },
)

export function UserStoreWithOut() {
    return UserStore(pinia)
}
