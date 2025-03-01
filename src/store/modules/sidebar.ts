import { defineStore } from "pinia";
import { ref } from "vue";

export const SidebarStore = defineStore("sidebar", () => {
    const IsOpen = ref(true);
    function toggle() {
        IsOpen.value = !IsOpen.value;
    }
    function open() {
        IsOpen.value = true;
    }
    function close() {
        IsOpen.value = false;
    }
    return {
        IsOpen,
        toggle,
        open,
        close,
    };
},{
    persist: true,
});