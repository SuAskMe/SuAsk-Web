import { defineStore } from 'pinia'
import { ref } from 'vue'

export const ControlPanelStore = defineStore(
    'controlPanel',
    () => {
        const Item = ref<string>('ask-teacher')

        function setSelectedItem(item: string) {
            Item.value = item
        }

        function getSelectedItem(): string {
            return Item.value || ''
        }

        function clearSelectedItem() {
            Item.value = 'ask-teacher'
        }

        return { Item, setSelectedItem, getSelectedItem, clearSelectedItem }
    },
    {
        persist: true,
    },
)
