export function getTimeStr(timeStamp: number) {
    const now = new Date()
    const other = new Date(timeStamp)
    const year = other.getFullYear()
    const month = other.getMonth() + 1
    const day = other.getDate()
    const hour = other.getHours()
    const minute = other.getMinutes()
    if (year !== now.getFullYear()) {
        // 不同年
        return `${year}-${month}-${day}`
    } else if (month !== now.getMonth() + 1) {
        // 不同月
        return `${month}-${day}`
    } else if (day !== now.getDate()) {
        // 不同日
        const diff = now.getDate() - day
        if (diff === 1) {
            return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
        } else if (diff === 2) {
            return `前天 ${hour}:${minute < 10 ? '0' + minute : minute}`
        } else if (diff <= 7) {
            return `${diff}天前 ${hour}:${minute < 10 ? '0' + minute : minute}`
        } else {
            return `${month}-${day}`
        }
    } else {
        // 同一天
        return `${hour}:${minute < 10 ? '0' + minute : minute}`
    }
}
