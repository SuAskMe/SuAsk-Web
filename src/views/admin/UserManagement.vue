<template>
    <el-container class="admin-user-management">
        <el-header class="header">
            <h2>用户管理</h2>
        </el-header>
        <el-main class="main">
            <!-- 工具栏：搜索、筛选、创建 -->
            <div class="toolbar">
                <el-input
                    v-model="searchKeyword"
                    placeholder="搜索用户名、昵称或邮箱"
                    clearable
                    class="search-input"
                    @input="onSearchInput"
                >
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
                <el-select
                    v-model="filterRole"
                    placeholder="角色筛选"
                    class="role-filter"
                    @change="onRoleFilterChange"
                >
                    <el-option label="全部" value="" />
                    <el-option label="管理员" value="admin" />
                    <el-option label="教师" value="teacher" />
                    <el-option label="学生" value="student" />
                </el-select>
                <el-button type="primary" @click="openCreateDialog">
                    <el-icon><Plus /></el-icon>
                    创建用户
                </el-button>
            </div>

            <!-- 用户表格 -->
            <el-table
                :data="userList"
                v-loading="tableLoading"
                stripe
                class="user-table"
            >
                <el-table-column prop="name" label="用户名" min-width="120" />
                <el-table-column prop="nickname" label="昵称" min-width="120" />
                <el-table-column prop="email" label="邮箱" min-width="180" />
                <el-table-column prop="role" label="角色" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getRoleTagType(row.role)" size="small">
                            {{ getRoleLabel(row.role) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" min-width="160">
                    <template #default="{ row }">
                        {{ formatDate(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" link @click="openEditDialog(row)">
                            编辑
                        </el-button>
                        <el-button size="small" type="warning" link @click="openResetPasswordDialog(row)">
                            重置密码
                        </el-button>
                        <el-button size="small" type="danger" link @click="openDeleteDialog(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination
                    v-model:current-page="currentPage"
                    :page-size="pageSize"
                    :total="totalCount"
                    layout="total, prev, pager, next"
                    @current-change="onPageChange"
                />
            </div>

            <!-- 创建用户对话框 -->
            <el-dialog
                v-model="createDialogVisible"
                title="创建用户"
                width="500px"
                :close-on-click-modal="false"
                @closed="resetCreateForm"
            >
                <el-form
                    ref="createFormRef"
                    :model="createForm"
                    :rules="createRules"
                    label-width="80px"
                    label-position="left"
                >
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="createForm.name" placeholder="请输入用户名" maxlength="50" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="createForm.password"
                            type="password"
                            placeholder="请输入密码（至少6位）"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="createForm.email" placeholder="请输入邮箱" />
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-select v-model="createForm.role" placeholder="请选择角色" style="width: 100%">
                            <el-option label="管理员" value="admin" />
                            <el-option label="教师" value="teacher" />
                            <el-option label="学生" value="student" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="createForm.nickname" placeholder="请输入昵称" maxlength="50" />
                    </el-form-item>
                    <!-- 教师特有字段 -->
                    <template v-if="createForm.role === 'teacher'">
                        <el-form-item label="简介" prop="introduction">
                            <el-input
                                v-model="createForm.introduction"
                                type="textarea"
                                placeholder="请输入教师简介"
                                maxlength="500"
                                :rows="3"
                            />
                        </el-form-item>
                        <el-form-item label="提问箱权限" prop="perm">
                            <el-select v-model="createForm.perm" placeholder="请选择权限" style="width: 100%">
                                <el-option label="公开" value="public" />
                                <el-option label="需登录" value="protected" />
                                <el-option label="关闭" value="private" />
                            </el-select>
                        </el-form-item>
                    </template>
                </el-form>
                <template #footer>
                    <el-button @click="createDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="createLoading" @click="handleCreate">
                        确认创建
                    </el-button>
                </template>
            </el-dialog>

            <!-- 编辑用户对话框 -->
            <el-dialog
                v-model="editDialogVisible"
                title="编辑用户"
                width="500px"
                :close-on-click-modal="false"
                @closed="resetEditForm"
            >
                <el-form
                    ref="editFormRef"
                    :model="editForm"
                    :rules="editRules"
                    label-width="80px"
                    label-position="left"
                >
                    <el-form-item label="用户名">
                        <el-input :model-value="editForm.name" disabled />
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="editForm.nickname" placeholder="请输入昵称" maxlength="50" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email" placeholder="请输入邮箱" />
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-select v-model="editForm.role" placeholder="请选择角色" style="width: 100%">
                            <el-option label="管理员" value="admin" />
                            <el-option label="教师" value="teacher" />
                            <el-option label="学生" value="student" />
                        </el-select>
                    </el-form-item>
                    <!-- 教师特有字段 -->
                    <template v-if="editForm.role === 'teacher'">
                        <el-form-item label="简介" prop="introduction">
                            <el-input
                                v-model="editForm.introduction"
                                type="textarea"
                                placeholder="请输入教师简介"
                                maxlength="500"
                                :rows="3"
                            />
                        </el-form-item>
                        <el-form-item label="提问箱权限" prop="perm">
                            <el-select v-model="editForm.perm" placeholder="请选择权限" style="width: 100%">
                                <el-option label="公开" value="public" />
                                <el-option label="需登录" value="protected" />
                                <el-option label="关闭" value="private" />
                            </el-select>
                        </el-form-item>
                    </template>
                </el-form>
                <template #footer>
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="editLoading" @click="handleEdit">
                        保存修改
                    </el-button>
                </template>
            </el-dialog>

            <!-- 重置密码对话框 -->
            <el-dialog
                v-model="resetPasswordDialogVisible"
                title="重置密码"
                width="400px"
                :close-on-click-modal="false"
                @closed="resetPasswordForm.password = ''"
            >
                <p class="reset-password-hint">
                    为用户 <strong>{{ resetPasswordForm.name }}</strong> 设置新密码
                </p>
                <el-form
                    ref="resetPasswordFormRef"
                    :model="resetPasswordForm"
                    :rules="resetPasswordRules"
                >
                    <el-form-item prop="password">
                        <el-input
                            v-model="resetPasswordForm.password"
                            type="password"
                            placeholder="请输入新密码（至少6位）"
                            show-password
                        />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="resetPasswordLoading" @click="handleResetPassword">
                        确认重置
                    </el-button>
                </template>
            </el-dialog>

            <!-- 删除确认对话框 -->
            <el-dialog
                v-model="deleteDialogVisible"
                title="确认删除"
                width="400px"
                :close-on-click-modal="false"
            >
                <p class="delete-confirm-text">
                    确定要删除用户 <strong>{{ deleteTarget?.name }}</strong> 吗？此操作不可恢复。
                </p>
                <template #footer>
                    <el-button @click="deleteDialogVisible = false">取消</el-button>
                    <el-button type="danger" :loading="deleteLoading" @click="handleDelete">
                        确认删除
                    </el-button>
                </template>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
    getAdminUserList,
    createAdminUser,
    updateAdminUser,
    resetAdminUserPassword,
    deleteAdminUser,
    type AdminUserItem,
    type CreateAdminUserReq,
    type UpdateAdminUserReq,
} from '@/api/admin/admin.api'
import { UserStore } from '@/store/modules/user'

// ==================== 权限检查 ====================
const router = useRouter()
const userStore = UserStore()

onMounted(() => {
    if (userStore.getRole() !== 'admin') {
        router.replace('/')
        return
    }
    fetchUserList()
})

// ==================== 表格数据 ====================
const userList = ref<AdminUserItem[]>([])
const tableLoading = ref(false)
const currentPage = ref(1)
const pageSize = 20
const totalCount = ref(0)

// ==================== 搜索与筛选 ====================
const searchKeyword = ref('')
const filterRole = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
    searchTimer = setTimeout(() => {
        currentPage.value = 1
        fetchUserList()
    }, 300)
}

function onRoleFilterChange() {
    currentPage.value = 1
    fetchUserList()
}

function onPageChange(page: number) {
    currentPage.value = page
    fetchUserList()
}

// ==================== 数据获取 ====================
async function fetchUserList() {
    tableLoading.value = true
    try {
        const res = await getAdminUserList(
            currentPage.value,
            filterRole.value || undefined,
            searchKeyword.value || undefined,
        )
        if (res) {
            userList.value = res.list || []
            totalCount.value = res.total || 0
        }
    } catch (err: any) {
        ElMessage.error('获取用户列表失败')
    } finally {
        tableLoading.value = false
    }
}

// ==================== 工具函数 ====================
function getRoleLabel(role: string): string {
    const map: Record<string, string> = {
        admin: '管理员',
        teacher: '教师',
        student: '学生',
    }
    return map[role] || role
}

function getRoleTagType(role: string): '' | 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
        admin: 'danger',
        teacher: '',
        student: 'info',
    }
    return map[role] || 'info'
}

function formatDate(dateStr: string): string {
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

// ==================== 创建用户 ====================
const createDialogVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const createForm = reactive<CreateAdminUserReq>({
    name: '',
    password: '',
    email: '',
    role: 'student',
    nickname: '',
    introduction: '',
    perm: 'public',
})

const createRules: FormRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 50, message: '用户名长度为1-50个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 50, message: '昵称长度为1-50个字符', trigger: 'blur' },
    ],
}

function openCreateDialog() {
    createDialogVisible.value = true
}

function resetCreateForm() {
    createForm.name = ''
    createForm.password = ''
    createForm.email = ''
    createForm.role = 'student'
    createForm.nickname = ''
    createForm.introduction = ''
    createForm.perm = 'public'
    createFormRef.value?.resetFields()
}

async function handleCreate() {
    if (!createFormRef.value) return
    const valid = await createFormRef.value.validate().catch(() => false)
    if (!valid) return

    createLoading.value = true
    try {
        const data: CreateAdminUserReq = {
            name: createForm.name,
            password: createForm.password,
            email: createForm.email,
            role: createForm.role,
            nickname: createForm.nickname,
        }
        if (createForm.role === 'teacher') {
            data.introduction = createForm.introduction || ''
            data.perm = createForm.perm || 'public'
        }
        await createAdminUser(data)
        ElMessage.success('用户创建成功')
        createDialogVisible.value = false
        fetchUserList()
    } catch (err: any) {
        ElMessage.error(err?.message || '创建用户失败')
    } finally {
        createLoading.value = false
    }
}

// ==================== 编辑用户 ====================
const editDialogVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
    id: 0,
    name: '',
    nickname: '',
    email: '',
    role: '',
    introduction: '',
    perm: 'public',
})

const editRules: FormRules = {
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 50, message: '昵称长度为1-50个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

function openEditDialog(user: AdminUserItem) {
    editForm.id = user.id
    editForm.name = user.name
    editForm.nickname = user.nickname
    editForm.email = user.email
    editForm.role = user.role
    editForm.introduction = user.introduction || ''
    editForm.perm = 'public'
    editDialogVisible.value = true
}

function resetEditForm() {
    editForm.id = 0
    editForm.name = ''
    editForm.nickname = ''
    editForm.email = ''
    editForm.role = ''
    editForm.introduction = ''
    editForm.perm = 'public'
    editFormRef.value?.resetFields()
}

async function handleEdit() {
    if (!editFormRef.value) return
    const valid = await editFormRef.value.validate().catch(() => false)
    if (!valid) return

    editLoading.value = true
    try {
        const data: UpdateAdminUserReq = {
            nickname: editForm.nickname,
            email: editForm.email,
            role: editForm.role,
        }
        if (editForm.role === 'teacher') {
            data.introduction = editForm.introduction || ''
            data.perm = editForm.perm || 'public'
        }
        await updateAdminUser(editForm.id, data)
        ElMessage.success('用户信息更新成功')
        editDialogVisible.value = false
        fetchUserList()
    } catch (err: any) {
        ElMessage.error(err?.message || '更新用户信息失败')
    } finally {
        editLoading.value = false
    }
}

// ==================== 重置密码 ====================
const resetPasswordDialogVisible = ref(false)
const resetPasswordLoading = ref(false)
const resetPasswordFormRef = ref<FormInstance>()
const resetPasswordForm = reactive({
    id: 0,
    name: '',
    password: '',
})

const resetPasswordRules: FormRules = {
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    ],
}

function openResetPasswordDialog(user: AdminUserItem) {
    resetPasswordForm.id = user.id
    resetPasswordForm.name = user.name
    resetPasswordForm.password = ''
    resetPasswordDialogVisible.value = true
}

async function handleResetPassword() {
    if (!resetPasswordFormRef.value) return
    const valid = await resetPasswordFormRef.value.validate().catch(() => false)
    if (!valid) return

    resetPasswordLoading.value = true
    try {
        await resetAdminUserPassword(resetPasswordForm.id, resetPasswordForm.password)
        ElMessage.success('密码重置成功')
        resetPasswordDialogVisible.value = false
    } catch (err: any) {
        ElMessage.error(err?.message || '重置密码失败')
    } finally {
        resetPasswordLoading.value = false
    }
}

// ==================== 删除用户 ====================
const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const deleteTarget = ref<AdminUserItem | null>(null)

function openDeleteDialog(user: AdminUserItem) {
    deleteTarget.value = user
    deleteDialogVisible.value = true
}

async function handleDelete() {
    if (!deleteTarget.value) return

    deleteLoading.value = true
    try {
        await deleteAdminUser(deleteTarget.value.id)
        ElMessage.success('用户删除成功')
        deleteDialogVisible.value = false
        fetchUserList()
    } catch (err: any) {
        ElMessage.error(err?.message || '删除用户失败')
    } finally {
        deleteLoading.value = false
    }
}
</script>

<style scoped lang="scss">
.admin-user-management {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ebeef5;
        padding: 0 20px;

        h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }
    }

    .main {
        padding: 20px;
        overflow-y: auto;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;

        .search-input {
            width: 280px;
        }

        .role-filter {
            width: 140px;
        }
    }

    .user-table {
        width: 100%;
        border-radius: 8px;
    }

    .pagination-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .reset-password-hint {
        margin-bottom: 16px;
        color: #606266;
    }

    .delete-confirm-text {
        color: #606266;
        line-height: 1.6;
    }
}
</style>
