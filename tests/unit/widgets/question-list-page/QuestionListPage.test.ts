// @vitest-environment jsdom

import { defineComponent, h, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuestionListPage from '@/widgets/question-list-page/ui/QuestionListPage.vue'

const deviceState = reactive({
    isMobile: false,
})

const wrapRef = reactive({
    scrollTop: 0,
    clientHeight: 0,
    scrollHeight: 0,
})

vi.mock('@/shared/model/device-type.store', () => ({
    DeviceTypeStore: () => deviceState,
}))

vi.mock('@/shared/ui/background-img', () => ({
    default: defineComponent({
        name: 'BackgroundImgStub',
        props: {
            img_index: {
                type: Number,
                required: true,
            },
        },
        setup(props) {
            return () =>
                h('div', { class: 'background-img-stub', 'data-img-index': props.img_index })
        },
    }),
}))

const ElContainerStub = defineComponent({
    name: 'ElContainerStub',
    setup(_, { slots, attrs }) {
        return () => h('div', attrs, slots.default?.())
    },
})

const ElHeaderStub = defineComponent({
    name: 'ElHeaderStub',
    setup(_, { slots, attrs }) {
        return () => h('header', attrs, slots.default?.())
    },
})

const ElMainStub = defineComponent({
    name: 'ElMainStub',
    setup(_, { slots, attrs }) {
        return () => h('main', attrs, slots.default?.())
    },
})

const ElScrollbarStub = defineComponent({
    name: 'ElScrollbarStub',
    emits: ['scroll'],
    setup(_, { slots, emit, expose, attrs }) {
        expose({ wrapRef })
        return () =>
            h(
                'div',
                {
                    ...attrs,
                    class: ['el-scrollbar-stub', attrs.class],
                    onScroll: () => emit('scroll'),
                },
                slots.default?.(),
            )
    },
})

describe('QuestionListPage', () => {
    beforeEach(() => {
        deviceState.isMobile = false
        wrapRef.scrollTop = 0
        wrapRef.clientHeight = 0
        wrapRef.scrollHeight = 0
    })

    const mountPage = (props?: Partial<InstanceType<typeof QuestionListPage>['$props']>) =>
        mount(QuestionListPage, {
            props: {
                imgIndex: 2,
                ...props,
            },
            global: {
                stubs: {
                    ElContainer: ElContainerStub,
                    ElHeader: ElHeaderStub,
                    ElMain: ElMainStub,
                    ElScrollbar: ElScrollbarStub,
                },
                directives: {
                    loading: () => undefined,
                },
            },
            slots: {
                header: '<div class="header-slot">header</div>',
                toolbar: '<div class="toolbar-slot">toolbar</div>',
                default: '<div class="content-slot">content</div>',
                floating: '<button class="floating-slot">floating</button>',
            },
        })

    it('renders all slots and shell classes', () => {
        deviceState.isMobile = true
        const wrapper = mountPage({ borderTop: false, scrollMask: true })

        expect(wrapper.find('.header-slot').exists()).toBe(true)
        expect(wrapper.find('.toolbar-slot').exists()).toBe(true)
        expect(wrapper.find('.content-slot').exists()).toBe(true)
        expect(wrapper.find('.floating-slot').exists()).toBe(true)
        expect(wrapper.classes()).toContain('question-list-page--borderless')
        expect(wrapper.classes()).toContain('question-list-page--masked')
        expect(wrapper.find('.question-list-page__content').classes()).toContain(
            'question-list-page__content--mobile',
        )
    })

    it('emits reachBottom when the scrollbar reaches the end', async () => {
        const wrapper = mountPage({ bottomThreshold: 10 })

        wrapRef.scrollTop = 80
        wrapRef.clientHeight = 20
        wrapRef.scrollHeight = 105

        await wrapper.find('.el-scrollbar-stub').trigger('scroll')

        expect(wrapper.emitted('reachBottom')).toHaveLength(1)
    })

    it('does not emit reachBottom while loading', async () => {
        const wrapper = mountPage({ loading: true })

        wrapRef.scrollTop = 90
        wrapRef.clientHeight = 20
        wrapRef.scrollHeight = 100

        await wrapper.find('.el-scrollbar-stub').trigger('scroll')

        expect(wrapper.emitted('reachBottom')).toBeUndefined()
    })

    it('scrollToTop resets the inner wrap scroll position', async () => {
        const wrapper = mountPage()
        wrapRef.scrollTop = 120

        wrapper.vm.scrollToTop()
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(wrapRef.scrollTop).toBe(0)
    })
})
