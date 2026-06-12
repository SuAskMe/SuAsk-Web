// @vitest-environment jsdom

import { defineComponent, h, reactive } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuestionHeader from '@/widgets/question-header/QuestionHeader.vue'

const shared = vi.hoisted(() => ({
    requestGetMock: vi.fn(),
    deviceState: {
        isMobile: false,
    },
    sidebarState: {
        IsOpen: false,
    },
}))

const deviceState = reactive(shared.deviceState)
const sidebarState = reactive(shared.sidebarState)

vi.mock('@/shared/api/request', () => ({
    default: {
        get: shared.requestGetMock,
    },
}))

vi.mock('@/shared/model/device-type.store', () => ({
    DeviceTypeStore: () => deviceState,
}))

vi.mock('@/widgets/app-shell/model', () => ({
    SidebarStore: () => sidebarState,
}))

const SvgIconStub = defineComponent({
    name: 'SvgIconStub',
    setup(_, { attrs }) {
        return () => h('span', { class: 'svg-icon-stub', ...attrs })
    },
})

const ElDropdownStub = defineComponent({
    name: 'ElDropdown',
    setup(_, { slots, attrs }) {
        return () =>
            h('div', { class: 'dropdown-stub', ...attrs }, [slots.default?.(), slots.dropdown?.()])
    },
})

const ElDropdownMenuStub = defineComponent({
    name: 'ElDropdownMenu',
    setup(_, { slots }) {
        return () => h('div', { class: 'dropdown-menu-stub' }, slots.default?.())
    },
})

const ElDropdownItemStub = defineComponent({
    name: 'ElDropdownItem',
    setup(_, { slots, attrs }) {
        return () =>
            h(
                'button',
                {
                    class: 'dropdown-item-stub',
                    onClick: attrs.onClick as (() => void) | undefined,
                },
                slots.default?.(),
            )
    },
})

const ElAutocompleteStub = defineComponent({
    name: 'ElAutocomplete',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        fetchSuggestions: {
            type: Function,
            required: true,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        return () =>
            h('input', {
                class: 'autocomplete-stub',
                value: props.modelValue,
                onInput: (event: Event) =>
                    emit('update:modelValue', (event.target as HTMLInputElement).value),
            })
    },
})

const createDeferred = <T>() => {
    let resolve!: (value: T) => void
    const promise = new Promise<T>((res) => {
        resolve = res
    })
    return { promise, resolve }
}

const getFetchSuggestions = (wrapper: VueWrapper) => {
    const autocomplete = wrapper.findComponent(ElAutocompleteStub)
    return autocomplete.props('fetchSuggestions') as (
        queryString: string,
        cb: (results: unknown[]) => void,
    ) => Promise<void>
}

describe('QuestionHeader', () => {
    beforeEach(() => {
        shared.requestGetMock.mockReset()
        deviceState.isMobile = false
        sidebarState.IsOpen = false
    })

    const mountHeader = () =>
        mount(QuestionHeader, {
            props: {
                title: '热点问题',
                return_btn: true,
                sidebar_btn: true,
                search: true,
                sort_and_search: true,
                has_sort_upvote: true,
                get_keywords_url: '/questions/keywords',
                teacher_id: 7,
            },
            global: {
                stubs: {
                    'svg-icon': SvgIconStub,
                    SvgIcon: SvgIconStub,
                    ElDropdown: ElDropdownStub,
                    ElDropdownMenu: ElDropdownMenuStub,
                    ElDropdownItem: ElDropdownItemStub,
                    ElAutocomplete: ElAutocompleteStub,
                },
            },
        })

    it('emits return and sidebar actions', async () => {
        const wrapper = mountHeader()

        await wrapper.find('.return-btn').trigger('click')
        await wrapper.findAll('.svg-icon-stub')[1].trigger('click')

        expect(wrapper.emitted('return')).toHaveLength(1)
        expect(wrapper.emitted('sidebar')).toHaveLength(1)
    })

    it('emits sort changes from dropdown items', async () => {
        const wrapper = mountHeader()

        const items = wrapper.findAll('.dropdown-item-stub')
        await items[1].trigger('click')

        expect(wrapper.emitted('changeSort')).toEqual([[2]])
    })

    it('opens search input, emits trimmed search, then emits cancelSearch', async () => {
        const wrapper = mountHeader()

        const searchIcon = wrapper.find('.search-icon')
        await searchIcon.trigger('click')

        const input = wrapper.find('.autocomplete-stub')
        await input.setValue('  policy  ')
        await searchIcon.trigger('click')

        expect(wrapper.emitted('search')).toEqual([['policy']])

        await wrapper.find('.cancel-btn').trigger('click')
        expect(wrapper.emitted('cancelSearch')).toHaveLength(1)
    })

    it('fetches keyword suggestions with current sort type and teacher id', async () => {
        shared.requestGetMock.mockResolvedValue({
            data: {
                words: [{ value: 'policy' }],
            },
        })

        const wrapper = mountHeader()
        await wrapper.findAll('.dropdown-item-stub')[1].trigger('click')
        await wrapper.find('.search-icon').trigger('click')

        const fetchSuggestions = getFetchSuggestions(wrapper)
        const callback = vi.fn()

        await fetchSuggestions('po', callback)

        expect(shared.requestGetMock).toHaveBeenCalledWith('/questions/keywords', {
            params: {
                keyword: 'po',
                sort_type: 2,
                teacher_id: 7,
            },
        })
        expect(callback).toHaveBeenCalledWith([{ value: 'policy' }])
    })

    it('short search text returns empty suggestions without requesting data', async () => {
        const wrapper = mountHeader()
        await wrapper.find('.search-icon').trigger('click')

        const fetchSuggestions = getFetchSuggestions(wrapper)
        const callback = vi.fn()

        await fetchSuggestions('a', callback)

        expect(shared.requestGetMock).not.toHaveBeenCalled()
        expect(callback).toHaveBeenCalledWith([])
    })

    it('ignores stale keyword suggestions when a newer query resolves first', async () => {
        const first = createDeferred<{ data: { words: { value: string }[] } }>()
        const second = createDeferred<{ data: { words: { value: string }[] } }>()
        shared.requestGetMock.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)

        const wrapper = mountHeader()
        await wrapper.find('.search-icon').trigger('click')
        const fetchSuggestions = getFetchSuggestions(wrapper)
        const oldCallback = vi.fn()
        const newCallback = vi.fn()

        const oldRequest = fetchSuggestions('po', oldCallback)
        const newRequest = fetchSuggestions('pol', newCallback)
        second.resolve({ data: { words: [{ value: 'policy' }] } })
        await newRequest
        first.resolve({ data: { words: [{ value: 'power' }] } })
        await oldRequest

        expect(newCallback).toHaveBeenCalledWith([{ value: 'policy' }])
        expect(oldCallback).not.toHaveBeenCalled()
    })

    it('short query invalidates pending keyword suggestions', async () => {
        const pending = createDeferred<{ data: { words: { value: string }[] } }>()
        shared.requestGetMock.mockReturnValueOnce(pending.promise)

        const wrapper = mountHeader()
        await wrapper.find('.search-icon').trigger('click')
        const fetchSuggestions = getFetchSuggestions(wrapper)
        const oldCallback = vi.fn()
        const shortCallback = vi.fn()

        const oldRequest = fetchSuggestions('po', oldCallback)
        await fetchSuggestions('p', shortCallback)
        pending.resolve({ data: { words: [{ value: 'policy' }] } })
        await oldRequest

        expect(shortCallback).toHaveBeenCalledWith([])
        expect(oldCallback).not.toHaveBeenCalled()
    })

    it('uses cached keyword suggestions for repeated same query context', async () => {
        shared.requestGetMock.mockResolvedValue({
            data: {
                words: [{ value: 'policy' }],
            },
        })

        const wrapper = mountHeader()
        await wrapper.find('.search-icon').trigger('click')
        const fetchSuggestions = getFetchSuggestions(wrapper)
        const firstCallback = vi.fn()
        const secondCallback = vi.fn()

        await fetchSuggestions('po', firstCallback)
        await fetchSuggestions('po', secondCallback)

        expect(shared.requestGetMock).toHaveBeenCalledTimes(1)
        expect(firstCallback).toHaveBeenCalledWith([{ value: 'policy' }])
        expect(secondCallback).toHaveBeenCalledWith([{ value: 'policy' }])
    })

    it('does not reuse cached keyword suggestions across sort types', async () => {
        shared.requestGetMock
            .mockResolvedValueOnce({ data: { words: [{ value: 'policy' }] } })
            .mockResolvedValueOnce({ data: { words: [{ value: 'popular' }] } })

        const wrapper = mountHeader()
        await wrapper.find('.search-icon').trigger('click')
        const fetchSuggestions = getFetchSuggestions(wrapper)
        const firstCallback = vi.fn()
        const secondCallback = vi.fn()

        await fetchSuggestions('po', firstCallback)
        await wrapper.find('.cancel-btn').trigger('click')
        await wrapper.findAll('.dropdown-item-stub')[1].trigger('click')
        await wrapper.find('.search-icon').trigger('click')
        const nextFetchSuggestions = getFetchSuggestions(wrapper)
        await nextFetchSuggestions('po', secondCallback)

        expect(shared.requestGetMock).toHaveBeenCalledTimes(2)
        expect(shared.requestGetMock).toHaveBeenLastCalledWith('/questions/keywords', {
            params: {
                keyword: 'po',
                sort_type: 2,
                teacher_id: 7,
            },
        })
        expect(firstCallback).toHaveBeenCalledWith([{ value: 'policy' }])
        expect(secondCallback).toHaveBeenCalledWith([{ value: 'popular' }])
    })

    it('returns empty keyword suggestions when the request fails', async () => {
        shared.requestGetMock.mockRejectedValue(new Error('network error'))

        const wrapper = mountHeader()
        await wrapper.find('.search-icon').trigger('click')
        const fetchSuggestions = getFetchSuggestions(wrapper)
        const callback = vi.fn()

        await fetchSuggestions('po', callback)

        expect(callback).toHaveBeenCalledWith([])
    })
})
