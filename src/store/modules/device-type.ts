import { defineStore } from "pinia";
import { ref } from "vue";

export const DeviceTypeStore = defineStore("deviceType", () => {
    const isMobile = ref(window.innerWidth < 768);

    function handleResize() {
        isMobile.value = window.innerWidth < 768;
    }

    window.addEventListener("resize", handleResize);

    return {
        isMobile,
    };
});
