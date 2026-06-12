export interface RequestAuthAdapter {
    getRole: () => string
}

const defaultRequestAuthAdapter: RequestAuthAdapter = {
    getRole: () => '',
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
