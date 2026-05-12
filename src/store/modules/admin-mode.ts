import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pinia } from '..'

export const AdminModeStore = defineStore(
    'admin-mode',
    () => {
        const enabled = ref<boolean>(false)

        function toggle() {
            enabled.value = !enabled.value
        }

        function enable() {
            enabled.value = true
        }

        function disable() {
            enabled.value = false
        }

        function isEnabled(): boolean {
            return enabled.value
        }

        return {
            enabled,
            toggle,
            enable,
            disable,
            isEnabled,
        }
    },
    {
        persist: true,
    },
)

export function AdminModeStoreWithOut() {
    return AdminModeStore(pinia)
}
