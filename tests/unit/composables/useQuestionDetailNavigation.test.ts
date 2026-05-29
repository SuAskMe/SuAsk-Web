import { nextTick, reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuestionDetailNavigation } from '@/composables/useQuestionDetailNavigation'

type SyncStoreStub = {
    Views: number
    IndexOf: number
    QuestionID: number
    SetSync: ReturnType<typeof vi.fn>
}

const shared = vi.hoisted(() => ({
    push: vi.fn(),
    syncStore: null as unknown as SyncStoreStub | null,
}))

const syncStore = reactive({
    Views: 0,
    IndexOf: -1,
    QuestionID: -1,
    SetSync: vi.fn((index: number, questionId: number, views: number) => {
        syncStore.IndexOf = index
        syncStore.QuestionID = questionId
        syncStore.Views = views
    }),
})

shared.syncStore = syncStore

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: shared.push,
    }),
}))

vi.mock('@/store/modules/question-detail', () => ({
    SyncStore: () => shared.syncStore,
}))

describe('useQuestionDetailNavigation', () => {
    beforeEach(() => {
        shared.push.mockReset()
        syncStore.Views = 0
        syncStore.IndexOf = -1
        syncStore.QuestionID = -1
        syncStore.SetSync.mockClear()
    })

    it('navigates to detail page and syncs current question state', () => {
        const questionList = reactive([
            { id: 11, views: 7 },
            { id: 22, views: 5 },
        ])

        const { navigateTo } = useQuestionDetailNavigation(questionList)
        navigateTo(1)

        expect(syncStore.SetSync).toHaveBeenCalledWith(1, 22, 5)
        expect(shared.push).toHaveBeenCalledWith({ path: '/question-detail/22' })
    })

    it('updates the cached item views when SyncStore reports a changed count', async () => {
        const questionList = reactive([
            { id: 11, views: 7 },
            { id: 22, views: 5 },
        ])

        const { navigateTo } = useQuestionDetailNavigation(questionList)
        navigateTo(0)

        syncStore.Views = 12
        await nextTick()

        expect(questionList[0].views).toBe(12)
    })
})
