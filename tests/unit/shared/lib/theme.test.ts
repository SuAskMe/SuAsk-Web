import { describe, expect, it, vi } from 'vitest'
import { useThemeBackgroundIndex } from '@/shared/lib/theme'

vi.mock('@/app/store/modules/user', () => ({
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
