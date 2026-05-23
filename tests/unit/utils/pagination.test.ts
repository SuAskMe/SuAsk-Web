import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { usePagination } from '@/utils/pagination'

const { successMock } = vi.hoisted(() => ({
    successMock: vi.fn(),
}))

vi.mock('element-plus', () => ({
    ElMessage: {
        success: successMock,
    },
}))

describe('usePagination', () => {
    beforeEach(() => {
        successMock.mockReset()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('loads and appends paginated question_list data', async () => {
        const fetchData = vi
            .fn()
            .mockResolvedValueOnce({
                remain_page: 1,
                question_list: [{ id: 1 }],
            })
            .mockResolvedValueOnce({
                remain_page: 0,
                question_list: [{ id: 2 }],
            })

        const pagination = usePagination<{ id: number }>({
            fetchData,
            initialPage: 0,
            initialSortType: 0,
        })

        await pagination.loadMore(0)
        await pagination.loadMore()

        expect(fetchData).toHaveBeenNthCalledWith(1, {
            page: 1,
            sort_type: 0,
        })
        expect(fetchData).toHaveBeenNthCalledWith(2, {
            page: 2,
            sort_type: 0,
        })
        expect(pagination.data).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('refreshes from page 1 and forwards keyword search', async () => {
        const fetchData = vi
            .fn()
            .mockResolvedValueOnce({
                remain_page: 1,
                question_list: [{ id: 1 }],
            })
            .mockResolvedValueOnce({
                remain_page: 0,
                question_list: [{ id: 3 }],
            })

        const pagination = usePagination<{ id: number }>({
            fetchData,
            initialPage: 0,
            initialSortType: 0,
        })

        await pagination.loadMore(0)
        await pagination.search('policy')

        expect(fetchData).toHaveBeenNthCalledWith(2, {
            page: 1,
            sort_type: 0,
            keyword: 'policy',
        })
        expect(pagination.data).toEqual([{ id: 3 }])
    })

    it('supports favorite_list payloads and cancelSearch clears keyword state', async () => {
        const fetchData = vi
            .fn()
            .mockResolvedValueOnce({
                remain_page: 1,
                favorite_list: [{ id: 8 }],
            })
            .mockResolvedValueOnce({
                remain_page: 1,
                favorite_list: [{ id: 9 }],
            })
            .mockResolvedValueOnce({
                remain_page: 0,
                favorite_list: [{ id: 10 }],
            })

        const pagination = usePagination<{ id: number }>({
            fetchData,
            initialPage: 0,
            initialSortType: 0,
        })

        await pagination.loadMore(0)
        await pagination.search('draft')
        await pagination.cancelSearch()

        expect(fetchData).toHaveBeenNthCalledWith(3, {
            page: 1,
            sort_type: 0,
        })
        expect(pagination.data).toEqual([{ id: 10 }])
    })

    it('only shows the end message once during the lock window', async () => {
        vi.useFakeTimers()

        const fetchData = vi.fn().mockResolvedValue({
            remain_page: 0,
            question_list: [{ id: 1 }],
        })

        const pagination = usePagination<{ id: number }>({
            fetchData,
            initialPage: 0,
            initialSortType: 0,
        })

        await pagination.loadMore(0)
        await pagination.loadMore()
        await pagination.loadMore()

        expect(fetchData).toHaveBeenCalledTimes(1)
        expect(successMock).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(2001)
        await pagination.loadMore()

        expect(successMock).toHaveBeenCalledTimes(2)
    })
})
