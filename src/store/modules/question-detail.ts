import { defineStore } from "pinia";
import { ref } from "vue";

export const SyncStore = defineStore("sync", () => {
    const IndexOf = ref(-1);
    const QuestionID = ref(-1);
    const Views = ref(0);
    function SetSync(index: number, Qid: number, views: number) {
        IndexOf.value = index;
        QuestionID.value = Qid;
        Views.value = views;
    }
    function ClearSync() {
        IndexOf.value = -1;
        QuestionID.value = -1;
        Views.value = 0;
    }
    function ChangViews(views: number) {
        Views.value = views;
    }
    return {
        IndexOf,
        QuestionID,
        Views,
        SetSync,
        ClearSync,
        ChangViews,
    };
});
