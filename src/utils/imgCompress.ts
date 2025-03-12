const fileToDataURL = (file: Blob): Promise<any> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = (e) => resolve((e.target as FileReader).result)
        reader.readAsDataURL(file)
    })
}
const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = dataURL
    })
}
const canvastoFile = (
    canvas: HTMLCanvasElement,
    type: string,
    quality: number,
): Promise<Blob | null> => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
}
/**
 * 图片压缩方法
 * @param {Object}  file 图片文件
 * @param {String} type 想压缩成的文件类型
 * @param {Nubmber} quality 压缩质量参数
 * @returns 压缩后的新图片
 */
export const compressionFile = (file: File, type = 'image/jpeg', quality = 0.5): Promise<File> => {
    return new Promise(async (resolve) => {
        const fileName = file.name
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        const base64 = await fileToDataURL(file)
        const img = await dataURLToImage(base64)
        canvas.width = img.width
        canvas.height = img.height
        context.clearRect(0, 0, img.width, img.height)
        context.drawImage(img, 0, 0, img.width, img.height)
        const blob = (await canvastoFile(canvas, type, quality)) as Blob // quality:0.5可根据实际情况计算
        const newFile = new File([blob], fileName, {
            type: type,
        })
        return resolve(newFile)
    })
}

export const compressionBlob = (
    blob: Blob,
    type = 'image/jpeg',
    quality = 0.5,
    maxW = 1000,
    maxH = 1000,
): Promise<Blob> => {
    return new Promise(async (resolve) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        const base64 = await fileToDataURL(blob)
        const img = await dataURLToImage(base64)
        const w = img.width
        const h = img.height
        if (w > maxW || h > maxH) {
            const scale = Math.min(maxW / w, maxH / h)
            canvas.width = w * scale
            canvas.height = h * scale
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(img, 0, 0, w, h, 0, 0, canvas.width, canvas.height)
        } else {
            canvas.width = w
            canvas.height = h
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(img, 0, 0, w, h)
        }
        const newBlob = (await canvastoFile(canvas, type, quality)) as Blob // quality:0.5可根据实际情况计算
        return resolve(newBlob)
    })
}
