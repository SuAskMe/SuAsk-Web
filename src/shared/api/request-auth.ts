export interface RequestAuthAdapter {
    getToken: () => string
    getRole: () => string
    clearSession: () => void
}

const defaultRequestAuthAdapter: RequestAuthAdapter = {
    getToken: () => '',
    getRole: () => '',
    clearSession: () => {},
}

let requestAuthAdapter: RequestAuthAdapter = defaultRequestAuthAdapter

export function configureRequestAuth(adapter: Partial<RequestAuthAdapter>) {
    requestAuthAdapter = {
        ...requestAuthAdapter,
        ...adapter,
    }
}

export function resetRequestAuth() {
    requestAuthAdapter = defaultRequestAuthAdapter
}

export function getRequestAuthAdapter() {
    return requestAuthAdapter
}
