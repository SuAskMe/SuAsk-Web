import { UserStore } from '@/store/modules/user'
import { computed } from 'vue'

export function useThemeBackgroundIndex() {
    const userStore = UserStore()

    return computed(() => userStore.getUser().themeId || 1)
}
