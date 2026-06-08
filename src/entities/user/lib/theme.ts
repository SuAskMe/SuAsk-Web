import { UserStore } from '../model/user.store'
import { computed } from 'vue'

export function useThemeBackgroundIndex() {
    const userStore = UserStore()

    return computed(() => userStore.getUser().themeId || 1)
}
