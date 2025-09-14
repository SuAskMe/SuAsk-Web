import { ElMessage } from 'element-plus'
import { reactive } from 'vue'

export interface PaginationOptions<T> {
    fetchData: (params: PaginationParams) => Promise<PaginationResponse<T>>
    initialPage?: number
    initialSortType?: number
}

export interface PaginationParams {
    page: number
    sort_type: number
    keyword?: string
}

export interface PaginationResponse<T> {
    remain_page: number
    question_list?: T[]
    favorite_list?: T[]
}

export interface UsePaginationReturn<T> {
    data: T[]
    loading: boolean
    isEnd: boolean
    currentPage: number
    sortType: number
    keyword: string
    init: () => void
    loadMore: (sortType?: number, keyword?: string, cancelSearch?: boolean) => Promise<void>
    refresh: (sortType?: number, keyword?: string) => Promise<void>
    search: (keyword: string) => Promise<void>
    cancelSearch: () => Promise<void>
    resetScroll: () => void
}

export function usePagination<T>(options: PaginationOptions<T>): UsePaginationReturn<T> {
    const { fetchData, initialPage = 1, initialSortType = -1 } = options

    let isEnd = false
    let currentPage = initialPage
    let sortType = initialSortType
    let keyword = ''
    let loading = false
    let lock = false

    const data: T[] = reactive([])

    const init = () => {
        isEnd = false
        currentPage = initialPage
        sortType = initialSortType
        keyword = ''
        lock = false
        data.length = 0
    }

    const loadMore = async (sortType_?: number, keyword_?: string, cancelSearch?: boolean) => {
        if (loading) return

        // 使用 hasOwnProperty 来检查是否传入了排序参数
        const hasSortType = sortType_ !== undefined
        const hasKeyword = keyword_ !== undefined
        
        if (hasSortType && sortType_ !== sortType) {
            currentPage = 1
            sortType = sortType_
            isEnd = false
        } else if (hasKeyword && keyword_ !== keyword) {
            currentPage = 1
            keyword = keyword_ || ''
            isEnd = false
        } else if (cancelSearch) {
            keyword = ''
            currentPage = 1
            isEnd = false
        } else {
            currentPage++
        }

        if (isEnd) {
            if (!lock) {
                lock = true
                ElMessage.success('没有更多了')
                setTimeout(() => {
                    lock = false
                }, 2000)
            }
            return
        }

        loading = true
        try {
            const params: PaginationParams = {
                page: currentPage,
                sort_type: sortType,
            }

            if (keyword) {
                params.keyword = keyword
            }

            const res = await fetchData(params)

            if (res.remain_page <= 0) {
                isEnd = true
            }

            const list = res.question_list || res.favorite_list || []
            if (currentPage === 1) {
                data.length = 0
            }
            data.push(...(list as T[]))
        } finally {
            loading = false
        }
    }

    const refresh = async (sortType_?: number, keyword_?: string) => {
        // 在刷新时总是清空数据
        data.length = 0
        isEnd = false
        
        if (sortType_ !== undefined) {
            sortType = sortType_
        }
        if (keyword_ !== undefined) {
            keyword = keyword_
        }
        currentPage = 1
        await loadMore(sortType, keyword)
    }

    const search = async (keyword_: string) => {
        await refresh(undefined, keyword_)
    }

    const cancelSearch = async () => {
        await refresh(undefined, '')
    }

    const resetScroll = () => {
        // 这个方法将被调用以通知组件需要重置滚动位置
        // 实际的滚动重置将在组件中完成
    }

    return {
        data,
        loading,
        isEnd,
        currentPage,
        sortType,
        keyword,
        init,
        loadMore,
        refresh,
        search,
        cancelSearch,
        resetScroll
    }
}