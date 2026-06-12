let idSeed = 0

export function GenId(): number {
    idSeed += 1
    return idSeed
}
