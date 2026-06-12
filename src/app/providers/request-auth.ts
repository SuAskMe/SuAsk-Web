import { UserStoreWithOut } from '@/entities/user'
import { configureRequestAuth } from '@/shared/api'

export function setupRequestAuth() {
    configureRequestAuth({
        getRole: () => UserStoreWithOut().getRole(),
    })
}
