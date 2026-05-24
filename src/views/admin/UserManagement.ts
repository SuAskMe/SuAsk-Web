import type { AdminUserItem, CreateAdminUserReq, UpdateAdminUserReq } from '@/api/admin/admin.api'

// ==================== 常量 ====================

export const roleOptions = [
    { label: '全部', value: '' },
    { label: '管理员', value: 'admin' },
    { label: '教师', value: 'teacher' },
    { label: '学生', value: 'student' },
    { label: '游客', value: 'guest' },
]

export const roleChoices = [
    { label: '管理员', value: 'admin' },
    { label: '教师', value: 'teacher' },
    { label: '学生', value: 'student' },
]

export const permChoices = [
    { label: '公开', value: 'public' },
    { label: '需登录', value: 'protected' },
    { label: '关闭', value: 'private' },
]

export const pageSize = 20

// ==================== 工具函数 ====================

export function getRoleLabel(role: string): string {
    const map: Record<string, string> = {
        admin: '管理员',
        teacher: '教师',
        student: '学生',
        guest: '游客',
    }
    return map[role] || role
}

export function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// ==================== 表单构建 ====================

export function buildCreateData(form: {
    name: string
    password: string
    email: string
    role: string
    nickname: string
    introduction?: string
    perm?: string
}): CreateAdminUserReq {
    const data: CreateAdminUserReq = {
        name: form.name,
        password: form.password,
        email: form.email,
        role: form.role as CreateAdminUserReq['role'],
        nickname: form.nickname,
    }
    if (form.role === 'teacher') {
        data.introduction = form.introduction || ''
        data.perm = form.perm || 'public'
    }
    return data
}

export function buildEditData(form: {
    nickname: string
    email: string
    role: string
    introduction?: string
    perm?: string
}): UpdateAdminUserReq {
    const data: UpdateAdminUserReq = {
        nickname: form.nickname,
        email: form.email,
        role: form.role,
        introduction: form.introduction || '',
    }
    if (form.role === 'teacher') {
        data.perm = form.perm || 'public'
    }
    return data
}

// ==================== 表单验证 ====================

export function validateCreateForm(form: {
    name: string
    password: string
    email: string
    nickname: string
}): string | null {
    if (!form.name || !form.password || !form.email || !form.nickname) {
        return '请填写所有必填项'
    }
    if (form.password.length < 6) {
        return '密码至少6个字符'
    }
    return null
}

export function validateEditForm(form: { nickname: string; email: string }): string | null {
    if (!form.nickname || !form.email) {
        return '昵称和邮箱不能为空'
    }
    return null
}

export function validatePassword(password: string): string | null {
    if (password.length < 6) {
        return '密码至少6个字符'
    }
    return null
}

// ==================== 表单初始化 ====================

export function initCreateForm() {
    return {
        name: '',
        password: '',
        email: '',
        role: 'student',
        nickname: '',
        introduction: '',
        perm: 'public',
        avatarPreview: '',
        avatarFile: null as File | null,
    }
}

export function initEditForm(user: AdminUserItem) {
    return {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        introduction: user.introduction || '',
        perm: 'public',
    }
}
