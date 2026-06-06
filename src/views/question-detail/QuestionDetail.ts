import { favoriteApi } from '@/api/question/favorite.api'
import { GenId } from '@/shared/lib/gen-id'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'

export { GenId }

let skipLock = false

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.animate([{ background: '#80808050' }, { background: '#80808000' }], {
                    duration: 1500,
                    easing: 'ease-in-out',
                    iterations: 1,
                })
            }
        })
    },
    { threshold: 1.0 },
)

export const scrollToQuote = (key: { id: number; quoteId: number; userId: number }) => {
    const el = document.getElementById(`answer-${key.quoteId}`)
    if (el && !skipLock) {
        skipLock = true
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        observer.observe(el)
        setTimeout(() => {
            observer.unobserve(el)
            skipLock = false
        }, 2000)
    }
}

export async function Favorite(question_id: number): Promise<boolean | null> {
    const res = await favoriteApi({ question_id })
    if (res) {
        return res.is_favorite
    }
    ElMessage.error('请求失败')
    return null
}
