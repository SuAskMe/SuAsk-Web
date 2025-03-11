import { loginApi, logoutApi } from '@/api/user/login.api'
import { getUserInfoApi } from '@/api/user/user.api'
import { Role, type LoginReq, type User } from '@/model/user.model'
import type { Nullable } from 'element-plus/es/components/cascader-panel/src/node.mjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pinia } from '..'

export const UserStore = defineStore(
    'user',
    () => {
        const userInfo = ref<Nullable<User>>(null)
        const token = ref<Nullable<string>>(null)
        const role = ref<string>(Role.DEFAULT)

        function getUser(): User {
            return userInfo.value || ({} as User)
        }

        function getToken(): string {
            return token.value || ''
        }

        function getRole(): string {
            return role.value
        }

        function setToken(_token: string) {
            token.value = _token
        }

        function setUser(user: User) {
            userInfo.value = user
        }

        function setRole(_role: string) {
            role.value = _role
        }

        function resetState() {
            userInfo.value = null
            token.value = ''
            role.value = Role.DEFAULT
        }

        async function login(req: LoginReq): Promise<User | null> {
            try {
                const res = await loginApi(req)
                if (!res) {
                    return null
                }
                setToken(res.token)
                setRole(res.role)
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
            role,
            getUser,
            getToken,
            getRole,
            setToken,
            setUser,
            resetState,
            login,
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
