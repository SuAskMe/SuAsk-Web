const MAX_SIZE = 450;

export function getImgStyle(photos: string[] | undefined) {
    let hasImages = false;
    let size = 0;
    let containerWidth = 0;
    if (!photos || photos.length === 0) {
        // 没有图片
        return { size, hasImages, containerWidth };
    }
    if (photos.length > 9) {
        // 最多显示9张图片
        photos.length = 9;
    }
    hasImages = true;
    let col = photos.length >= 3 ? 3 : photos.length;
    let width = (100 - (col - 1) * 2) / col; // 图片宽度百分比
    size = (width / 100) * MAX_SIZE; // 图片大小，单位px
    containerWidth = col * size + (col - 1) * 10; // 图片容器宽度，单位px
    return { size, hasImages, containerWidth };
}

export function getTimeStr(timeStamp: number) {
    let now = new Date();
    let other = new Date(timeStamp);
    let year = other.getFullYear();
    let month = other.getMonth() + 1;
    let day = other.getDate();
    let hour = other.getHours();
    let minute = other.getMinutes();
    if (year !== now.getFullYear()) {
        // 不同年
        return `${year}-${month}-${day}`;
    } else if (month !== now.getMonth() + 1) {
        // 不同月
        return `${month}-${day}`;
    } else if (day !== now.getDate()) {
        // 不同日
        let diff = now.getDate() - day;
        if (diff === 1) {
            return `昨天 ${hour}:${minute < 10 ? "0" + minute : minute}`;
        } else if (diff === 2) {
            return `前天 ${hour}:${minute < 10 ? "0" + minute : minute}`;
        } else if (diff <= 7) {
            return `${diff}天前 ${hour}:${minute < 10 ? "0" + minute : minute}`;
        } else {
            return `${month}-${day}`;
        }
    } else {
        // 同一天
        return `${hour}:${minute < 10 ? "0" + minute : minute}`;
    }
}
