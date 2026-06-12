function splitSize(size: string) {
    for (let i = 0; i < size.length; i++) {
        if (size[i] >= 'a' && size[i] <= 'z') {
            return { val: parseFloat(size.slice(0, i)), unit: size.slice(i) }
        }
    }
    return { val: parseFloat(size), unit: '' }
}

export function getVisibleImageUrls(photos: string[] | undefined, maxCount = 8) {
    if (!photos || photos.length === 0) {
        return []
    }
    return photos.slice(0, maxCount)
}

export function getImageGridStyle(photos: string[] | undefined, maxSize = '450px') {
    const parsedSize = splitSize(maxSize)
    const val = parsedSize.val * 0.97
    const unit = parsedSize.unit
    const visiblePhotos = getVisibleImageUrls(photos)

    if (visiblePhotos.length === 0) {
        return { size: '0px', hasImages: false, containerWidth: 0, gap: 0 }
    }

    const col = 4
    const width = (100 - (col - 1) * 2) / col
    const size = (width / 100) * val
    const containerWidth = ((width * col + (col - 1) * 2) / 100) * val

    return {
        size: `${size}${unit}`,
        hasImages: true,
        containerWidth: `${containerWidth}${unit}`,
        gap: `${(2 / 100) * val}${unit}`,
    }
}
