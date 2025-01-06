import { defineStore } from "pinia";
import { ref } from "vue";

export const ControlPanelStore = defineStore("controlPanel",
    () => {
        const Item = ref<string>()

        function setSelectedItem(item: string) {
            Item.value = item
        }

        function getSelectedItem(): string {
            return Item.value || ''
        }

        return { Item, setSelectedItem, getSelectedItem }
    }, {
    persist: true
})

