import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Role } from '@/model/user.model'

type InterceptorRecord<TFulfilled, TRejected = unknown> = {
    handlers: Array<{
        fulfilled: TFulfilled
        rejected: TRejected
    }>
}

type RequestConfig = {
    headers: Record<string, string>
}

type ResponsePayload = {
    status: number
    data: {
        code?: number
        message?: string
        payload?: unknown
    }
}

type RequestFulfilled = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseFulfilled = (response: ResponsePayload) => unknown
type ResponseRejected = (error: unknown) => unknown

const mocks = vi.hoisted(() => ({
    error: vi.fn(),
    getToken: vi.fn(),
    getRole: vi.fn(),
    setToken: vi.fn(),
    resetState: vi.fn(),
    clearSelectedItem: vi.fn(),
    getDeviceId: vi.fn(),
}))

vi.mock('element-plus/es/components/message/index.mjs', () => ({
    ElMessage: {
        error: mocks.error,
    },
}))

vi.mock('@/store/modules/user', () => ({
    UserStoreWithOut: () => ({
        getToken: mocks.getToken,
        getRole: mocks.getRole,
        setToken: mocks.setToken,
        resetState: mocks.resetState,
    }),
}))

vi.mock('@/store/modules/control-panel', () => ({
    ControlPanelStore: () => ({
        clearSelectedItem: mocks.clearSelectedItem,
    }),
}))

vi.mock('@/utils/device', () => ({
    getDeviceId: mocks.getDeviceId,
}))

describe('request interceptors', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.useFakeTimers()
        mocks.error.mockReset()
        mocks.getToken.mockReset()
        mocks.getRole.mockReset()
        mocks.setToken.mockReset()
        mocks.resetState.mockReset()
        mocks.clearSelectedItem.mockReset()
        mocks.getDeviceId.mockReset()
        mocks.getToken.mockReturnValue('')
        mocks.getRole.mockReturnValue('')
        mocks.getDeviceId.mockReturnValue('device-123')
        Object.defineProperty(globalThis, 'location', {
            value: { href: '' },
            writable: true,
            configurable: true,
        })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('adds auth, admin mode, and device headers on requests', async () => {
        mocks.getToken.mockReturnValue('token-abc')
        mocks.getRole.mockReturnValue(Role.ADMIN)

        const request = (await import('@/utils/http/request')).default
        const interceptor = request.interceptors.request as unknown as InterceptorRecord<RequestFulfilled>
        const handler = interceptor.handlers[0].fulfilled

        const config = await handler({ headers: {} })

        expect(config.headers.Authorization).toBe('Bearer token-abc')
        expect(config.headers['X-Admin-Mode']).toBe('true')
        expect(config.headers['X-Device-Id']).toBe('device-123')
    })

    it('returns payload data on successful business responses', async () => {
        const request = (await import('@/utils/http/request')).default
        const interceptor = request.interceptors.response as unknown as InterceptorRecord<ResponseFulfilled>
        const handler = interceptor.handlers[0].fulfilled

        const result = await handler({
            status: 200,
            data: {
                code: 0,
                payload: { ok: true },
            },
        })

        expect(result).toEqual({
            code: 0,
            payload: { ok: true },
        })
    })

    it('handles login timeout by showing an error and scheduling redirect cleanup', async () => {
        const request = (await import('@/utils/http/request')).default
        const interceptor = request.interceptors.response as unknown as InterceptorRecord<ResponseFulfilled>
        const handler = interceptor.handlers[0].fulfilled

        const result = await handler({
            status: 200,
            data: {
                code: 401,
                message: 'expired',
            },
        })

        expect(result).toBeNull()
        expect(mocks.error).toHaveBeenCalledWith('登录超时，请重新登录')

        vi.advanceTimersByTime(1000)

        expect(mocks.setToken).toHaveBeenCalledWith('')
        expect(mocks.resetState).toHaveBeenCalled()
        expect(mocks.clearSelectedItem).toHaveBeenCalled()
        expect(globalThis.location.href).toBe('/login')
    })

    it('shows backend Chinese messages and returns null for handled business errors', async () => {
        const request = (await import('@/utils/http/request')).default
        const interceptor = request.interceptors.response as unknown as InterceptorRecord<ResponseFulfilled>
        const handler = interceptor.handlers[0].fulfilled

        const result = await handler({
            status: 200,
            data: {
                code: 500,
                message: '系统繁忙',
            },
        })

        expect(result).toBeNull()
        expect(mocks.error).toHaveBeenCalledWith('系统繁忙')
    })

    it('returns false and shows a generic message on transport errors', async () => {
        const request = (await import('@/utils/http/request')).default
        const interceptor = request.interceptors.response as unknown as InterceptorRecord<
            ResponseFulfilled,
            ResponseRejected
        >
        const handler = interceptor.handlers[0].rejected

        const result = await handler(new Error('network down'))

        expect(result).toBe(false)
        expect(mocks.error).toHaveBeenCalledWith('请求无响应')
    })
})
