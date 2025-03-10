import { defineStore } from 'pinia'
import { ref } from 'vue'

export const ComposeDialogStore = defineStore(
    'composeDialog',
    () => {
        const visible = ref<boolean>(false)

        function open() {
            visible.value = true
        }

        function close() {
            visible.value = false
        }

        return { visible, open, close }
    },
    {
        persist: true,
    },
)
