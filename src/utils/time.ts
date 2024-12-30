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