import { UserStoreWithOut } from '@/entities/user'
import { configureRequestAuth } from '@/shared/api'

export function setupRequestAuth() {
    configureRequestAuth({
        getToken: () => UserStoreWithOut().getToken(),
        getRole: () => UserStoreWithOut().getRole(),
        clearSession: () => {
            const userStore = UserStoreWithOut()
            userStore.setToken('')
            userStore.resetState()
        },
    })
}
