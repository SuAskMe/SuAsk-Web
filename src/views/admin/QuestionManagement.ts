import type {
    AdminDeletedStatusFilter,
    AdminQuestionItem,
    AdminQuestionListStatus,
} from '@/api/admin/admin.api'

export const pageSize = 20

export type AdminQuestionListFilter = AdminQuestionListStatus

export const statusOptions: Array<{ label: string; value: AdminQuestionListFilter }> = [
    { label: '全部', value: 'all' },
    { label: '已回答', value: 'answered' },
    { label: '未回答', value: 'unanswered' },
    { label: '已删除', value: 'deleted' },
]

export const deletedStatusOptions: Array<{
    label: string
    value: AdminDeletedStatusFilter
}> = [
    { label: '全部', value: 'all' },
    { label: '已删除', value: 'deleted' },
    { label: '未删除', value: 'undeleted' },
]

export function formatAdminTime(time: number): string {
    if (!time) return ''
    const date = new Date(time)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
        answered: '已回答',
        unanswered: '未回答',
    }
    return map[status] || status
}

export function getRoleLabel(role: string): string {
    const map: Record<string, string> = {
        admin: '管理员',
        teacher: '教师',
        student: '学生',
        guest: '游客',
    }
    return map[role] || '未知用户'
}

export function getTeacherLabel(question: AdminQuestionItem): string {
    if (question.dst_user_nickname || question.dst_user_name) {
        return question.dst_user_nickname || question.dst_user_name
    }
    return '未知用户'
}

export function getQuestionAuthorLabel(question: AdminQuestionItem): string {
    if (question.src_user_nickname || question.src_user_name) {
        return question.src_user_nickname || question.src_user_name
    }
    return '未知用户'
}

export function summarizeContent(contents: string, maxLength = 160): string {
    const normalized = (contents || '').replace(/\s+/g, ' ').trim()
    if (normalized.length <= maxLength) return normalized
    return `${normalized.slice(0, maxLength)}...`
}

export function getTotalPages(total: number): number {
    return Math.max(1, Math.ceil(total / pageSize))
}
