export function containsChineseCharacters(str: string) {
    const regex = /[\u4e00-\u9fa5]/;
    return regex.test(str);
}
