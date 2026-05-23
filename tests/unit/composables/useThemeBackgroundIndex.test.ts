import { describe, expect, it, vi } from 'vitest'
import { useThemeBackgroundIndex } from '@/composables/useThemeBackgroundIndex'

vi.mock('@/store/modules/user', () => ({
    UserStore: () => ({
        getUser: () => ({
            themeId: 3,
        }),
    }),
}))

describe('useThemeBackgroundIndex', () => {
    it('returns the current theme id when present', () => {
        const themeIndex = useThemeBackgroundIndex()

        expect(themeIndex.value).toBe(3)
    })
})
