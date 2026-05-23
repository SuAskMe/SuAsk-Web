import QuestionListPage from '@/components/question-list-page'
import { nextTick, ref } from 'vue'

export function useQuestionListPageShell() {
    const listPage = ref<InstanceType<typeof QuestionListPage>>()

    const resetScrollPosition = () => {
        nextTick(() => {
            listPage.value?.scrollToTop()
        })
    }

    return {
        listPage,
        resetScrollPosition,
    }
}
