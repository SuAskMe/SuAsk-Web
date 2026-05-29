// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MarkdownPreview from '@/components/markdown-preview/MarkdownPreview.vue'

describe('MarkdownPreview', () => {
    it('renders markdown text and external links', () => {
        const wrapper = mount(MarkdownPreview, {
            props: {
                modelValue: '**重点** [参考](https://example.com)',
            },
        })

        expect(wrapper.find('strong').text()).toBe('重点')

        const link = wrapper.find('a')
        expect(link.attributes('href')).toBe('https://example.com')
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
    })

    it('escapes raw html instead of rendering it', () => {
        const wrapper = mount(MarkdownPreview, {
            props: {
                modelValue: '<img src=x onerror=alert(1)>',
            },
        })

        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.text()).toContain('<img src=x onerror=alert(1)>')
    })
})
