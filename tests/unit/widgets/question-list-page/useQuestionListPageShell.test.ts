import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useQuestionListPageShell } from '@/widgets/question-list-page'

describe('useQuestionListPageShell', () => {
    it('calls scrollToTop on the bound page instance', async () => {
        const { listPage, resetScrollPosition } = useQuestionListPageShell()
        const scrollToTop = vi.fn()

        listPage.value = {
            scrollToTop,
        } as never

        resetScrollPosition()
        await nextTick()

        expect(scrollToTop).toHaveBeenCalledTimes(1)
    })

    it('does not throw when no page instance is bound', async () => {
        const { resetScrollPosition } = useQuestionListPageShell()

        expect(() => resetScrollPosition()).not.toThrow()
        await nextTick()
    })
})
