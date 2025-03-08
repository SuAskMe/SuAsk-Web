import { defineStore } from "pinia";
import { ref } from "vue";

export const UseQDMessageStore = defineStore("question-detail", () => {
    const HasError = ref(false);
    function setErr() {
        HasError.value = true;
    }
    function clearErr() {
        HasError.value = false;
    }
    return {
        HasError,
        setErr,
        clearErr,
    };
});
