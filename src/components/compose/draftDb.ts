export type { Answer, Question } from './db'

export async function loadDraftDb() {
    const { db } = await import('./db')

    return db
}
