import { SyncStore } from '@/app/store/modules/question-detail'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

interface SyncableQuestionItem {
    id: number
    views: number
}

export function useQuestionDetailNavigation<T extends SyncableQuestionItem>(questionList: T[]) {
    const router = useRouter()
    const syncStore = SyncStore()

    let record = {
        index: -1,
        id: -1,
        views: -1,
    }

    watch(
        () => syncStore.Views,
        () => {
            if (
                record.index >= 0 &&
                record.index < questionList.length &&
                record.index === syncStore.IndexOf &&
                record.id === syncStore.QuestionID &&
                record.views !== syncStore.Views
            ) {
                questionList[record.index].views = syncStore.Views
                record.views = syncStore.Views
            }
        },
    )

    const navigateTo = (key: number) => {
        const index = Number(key)
        const question = questionList[index]
        if (!question) {
            return
        }
        record = {
            index,
            id: question.id,
            views: question.views,
        }
        syncStore.SetSync(index, question.id, question.views)
        router.push({
            path: `/question-detail/${question.id}`,
        })
    }

    return {
        navigateTo,
    }
}
