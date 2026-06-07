export function containsChineseCharacters(str: string): boolean {
    const regex = /[一-龥]/
    return regex.test(str)
}
