import { loginApi, logoutApi, type LoginReq } from '@/entities/session'
import { guestLoginApi } from '@/entities/guest'
import { getUserInfoApi } from '../api/user.api'
import { Role, type User } from './user.model'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pinia } from '@/shared/model/pinia'

export const UserStore = defineStore(
    'user',
    () => {
        const userInfo = ref<User | null>(null)
        const authReady = ref(false)

        function getUser(): User {
            return userInfo.value || ({} as User)
        }

        function getRole(): string {
            return userInfo.value?.role || ''
        }

        function isLoggedIn(): boolean {
            return !!userInfo.value
        }

        function setUser(user: User) {
            userInfo.value = user
        }

        function resetState() {
            userInfo.value = null
        }

        async function bootstrapAuth(): Promise<User | null> {
            // When cookie auth is active, hitting /user restores the session.
            // If the cookie exists and is valid, the backend returns user info.
            // If no cookie / expired, the backend returns 401 → request interceptor
            // returns null → we treat as unauthenticated.
            try {
                const user = await getUserInfo()
                authReady.value = true
                return user
            } catch {
                authReady.value = true
                return null
            }
        }

        async function login(req: LoginReq): Promise<User | null> {
            try {
                const res = await loginApi(req)
                if (!res) {
                    return null
                }
                // Cookie is set by the backend; fetch user info.
                const user = await getUserInfo()
                return user
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
            try {
                const res = await guestLoginApi()
                if (!res) {
                    return null
                }
                // Cookie is set by the backend; fetch user info.
                const user = await getUserInfo()
                return user
            } catch {
                return null
            }
        }

        function isGuest(): boolean {
            return userInfo.value?.role === Role.GUEST
        }

        async function logout(): Promise<unknown> {
            if (isLoggedIn()) {
                const res = await logoutApi()
                resetState()
                if (res) {
                    return res
                }
            }
        }

        return {
            userInfo,
            authReady,
            getUser,
            getRole,
            isLoggedIn,
            setUser,
            resetState,
            bootstrapAuth,
            login,
            getUserInfo,
            guestLogin,
            isGuest,
            logout,
        }
    },
    // No persist — auth is cookie-based now.
)

export function UserStoreWithOut() {
    return UserStore(pinia)
}
