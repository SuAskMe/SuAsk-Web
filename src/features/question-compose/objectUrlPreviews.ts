export interface ObjectUrlPreview {
    id: number
    url: string
}

export function createObjectUrlPreview(blob: Blob, id: number): ObjectUrlPreview {
    return {
        id,
        url: URL.createObjectURL(blob),
    }
}

export function revokeObjectUrlPreview(preview?: Pick<ObjectUrlPreview, 'url'>) {
    if (preview?.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url)
    }
}

export function revokeObjectUrlPreviews(previews: readonly Pick<ObjectUrlPreview, 'url'>[]) {
    for (const preview of previews) {
        revokeObjectUrlPreview(preview)
    }
}
