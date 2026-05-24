<template>
    <el-container class="admin-page">
        <el-header class="admin-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>用户管理</h2>
        </el-header>

        <el-scrollbar class="admin-content">
            <!-- 工具栏 -->
            <div class="toolbar">
                <div class="search-box">
                    <svg-icon icon="search" color="#999" size="16px" />
                    <input
                        v-model="searchKeyword"
                        type="text"
                        placeholder="搜索用户名、昵称或邮箱..."
                        @input="onSearchInput"
                    />
                    <span
                        v-if="searchKeyword"
                        class="clear-btn"
                        @click="
                            searchKeyword = '';
                            onSearchInput();
                        "
                        >&times;</span
                    >
                </div>
                <div class="role-tabs">
                    <button
                        v-for="opt in roleOptions"
                        :key="opt.value"
                        :class="['role-tab', { active: filterRole === opt.value }]"
                        @click="
                            filterRole = opt.value;
                            onRoleFilterChange();
                        "
                    >
                        {{ opt.label }}
                    </button>
                </div>
                <button class="btn-create" @click="openCreateDialog">
                    <span class="plus">+</span> 创建用户
                </button>
            </div>

            <!-- 用户列表 -->
            <div class="user-list" v-if="!tableLoading && userList.length > 0">
                <div class="user-card" v-for="user in userList" :key="user.id">
                    <div class="user-info">
                        <UserAvatar :src="user.avatar" :name="user.nickname" :size="38" />
                        <div class="user-detail">
                            <div class="user-name">
                                {{ user.nickname }}
                                <span class="user-handle">@{{ user.name }}</span>
                            </div>
                            <div class="user-email">{{ user.email }}</div>
                        </div>
                        <span :class="['role-badge', `role-${user.role}`]">{{
                            getRoleLabel(user.role)
                        }}</span>
                    </div>
                    <div class="user-meta">
                        <span class="meta-time">{{ formatDate(user.created_at) }}</span>
                        <div class="user-actions">
                            <button class="action-btn edit" @click="openEditDialog(user)">
                                编辑
                            </button>
                            <button class="action-btn reset" @click="openResetPasswordDialog(user)">
                                重置密码
                            </button>
                            <button class="action-btn delete" @click="openDeleteDialog(user)">
                                删除
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 加载中 -->
            <div class="loading-state" v-if="tableLoading">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div class="empty-state" v-if="!tableLoading && userList.length === 0">
                <p>暂无用户数据</p>
            </div>

            <!-- 分页 -->
            <div class="pagination" v-if="totalCount > pageSize">
                <button
                    class="page-btn"
                    :disabled="currentPage <= 1"
                    @click="onPageChange(currentPage - 1)"
                >
                    ‹
                </button>
                <span class="page-info"
                    >{{ currentPage }} / {{ Math.ceil(totalCount / pageSize) }}</span
                >
                <button
                    class="page-btn"
                    :disabled="currentPage >= Math.ceil(totalCount / pageSize)"
                    @click="onPageChange(currentPage + 1)"
                >
                    ›
                </button>
                <span class="page-total">共 {{ totalCount }} 条</span>
            </div>
        </el-scrollbar>

        <!-- 遮罩层 -->
        <Transition name="fade">
            <div v-if="showModal" class="modal-overlay" @click.self="closeModal"></div>
        </Transition>

        <!-- 创建用户弹窗 -->
        <Transition name="slide-up">
            <div v-if="createDialogVisible" class="modal-panel">
                <div class="modal-header">
                    <h3>创建用户</h3>
                    <button class="modal-close" @click="createDialogVisible = false">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group avatar-upload-group">
                        <label>头像</label>
                        <div class="avatar-upload">
                            <UserAvatar
                                :src="createForm.avatarPreview"
                                :name="createForm.nickname || createForm.name || '新用户'"
                                :size="56"
                            />
                            <label class="upload-btn">
                                {{ createForm.avatarFile ? '重新选择' : '上传头像' }}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    @change="onCreateAvatarFileChange"
                                />
                            </label>
                            <button
                                v-if="createForm.avatarFile"
                                type="button"
                                class="clear-avatar-btn"
                                @click="clearCreateAvatar"
                            >
                                留空默认头像
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>用户名</label>
                        <input
                            v-model="createForm.name"
                            type="text"
                            placeholder="请输入用户名"
                            maxlength="50"
                        />
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input
                            v-model="createForm.password"
                            type="password"
                            placeholder="请输入密码（至少6位）"
                        />
                    </div>
                    <div class="form-group">
                        <label>邮箱</label>
                        <input v-model="createForm.email" type="email" placeholder="请输入邮箱" />
                    </div>
                    <div class="form-group">
                        <label>角色</label>
                        <div class="role-select">
                            <button
                                v-for="r in roleChoices"
                                :key="r.value"
                                :class="['role-option', { selected: createForm.role === r.value }]"
                                @click="createForm.role = r.value"
                            >
                                {{ r.label }}
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>昵称</label>
                        <input
                            v-model="createForm.nickname"
                            type="text"
                            placeholder="请输入昵称"
                            maxlength="50"
                        />
                    </div>
                    <template v-if="createForm.role === 'teacher'">
                        <div class="form-group">
                            <label>教师简介</label>
                            <textarea
                                v-model="createForm.introduction"
                                placeholder="请输入教师简介"
                                maxlength="500"
                                rows="3"
                            ></textarea>
                        </div>
                        <div class="form-group">
                            <label>提问箱权限</label>
                            <div class="role-select">
                                <button
                                    v-for="p in permChoices"
                                    :key="p.value"
                                    :class="[
                                        'role-option',
                                        { selected: createForm.perm === p.value },
                                    ]"
                                    @click="createForm.perm = p.value"
                                >
                                    {{ p.label }}
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="createDialogVisible = false">取消</button>
                    <button class="btn-confirm" :disabled="createLoading" @click="handleCreate">
                        {{ createLoading ? '创建中...' : '确认创建' }}
                    </button>
                </div>
            </div>
        </Transition>

        <!-- 编辑用户弹窗 -->
        <Transition name="slide-up">
            <div v-if="editDialogVisible" class="modal-panel">
                <div class="modal-header">
                    <h3>编辑用户</h3>
                    <button class="modal-close" @click="editDialogVisible = false">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- 头像修改 -->
                    <div class="form-group avatar-upload-group">
                        <label>头像</label>
                        <div class="avatar-upload">
                            <UserAvatar
                                :src="editForm.avatarPreview"
                                :name="editForm.nickname"
                                :size="56"
                            />
                            <label class="upload-btn">
                                更换头像
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    @change="onAvatarFileChange"
                                />
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>用户名</label>
                        <input :value="editForm.name" type="text" disabled class="disabled" />
                    </div>
                    <div class="form-group">
                        <label>昵称</label>
                        <input
                            v-model="editForm.nickname"
                            type="text"
                            placeholder="请输入昵称"
                            maxlength="50"
                        />
                    </div>
                    <div class="form-group">
                        <label>邮箱</label>
                        <input v-model="editForm.email" type="email" placeholder="请输入邮箱" />
                    </div>
                    <div class="form-group">
                        <label>简介</label>
                        <textarea
                            v-model="editForm.introduction"
                            placeholder="请输入用户简介"
                            maxlength="500"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label>角色</label>
                        <div class="role-select">
                            <button
                                v-for="r in roleChoices"
                                :key="r.value"
                                :class="['role-option', { selected: editForm.role === r.value }]"
                                @click="editForm.role = r.value"
                            >
                                {{ r.label }}
                            </button>
                        </div>
                    </div>
                    <template v-if="editForm.role === 'teacher'">
                        <div class="form-group">
                            <label>提问箱权限</label>
                            <div class="role-select">
                                <button
                                    v-for="p in permChoices"
                                    :key="p.value"
                                    :class="[
                                        'role-option',
                                        { selected: editForm.perm === p.value },
                                    ]"
                                    @click="editForm.perm = p.value"
                                >
                                    {{ p.label }}
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="editDialogVisible = false">取消</button>
                    <button class="btn-confirm" :disabled="editLoading" @click="handleEdit">
                        {{ editLoading ? '保存中...' : '保存修改' }}
                    </button>
                </div>
            </div>
        </Transition>

        <!-- 重置密码弹窗 -->
        <Transition name="slide-up">
            <div v-if="resetPasswordDialogVisible" class="modal-panel modal-sm">
                <div class="modal-header">
                    <h3>重置密码</h3>
                    <button class="modal-close" @click="resetPasswordDialogVisible = false">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-hint">
                        为用户 <strong>{{ resetPasswordForm.name }}</strong> 设置新密码
                    </p>
                    <div class="form-group">
                        <label>新密码</label>
                        <input
                            v-model="resetPasswordForm.password"
                            type="password"
                            placeholder="请输入新密码（至少6位）"
                        />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="resetPasswordDialogVisible = false">
                        取消
                    </button>
                    <button
                        class="btn-confirm"
                        :disabled="resetPasswordLoading"
                        @click="handleResetPassword"
                    >
                        {{ resetPasswordLoading ? '重置中...' : '确认重置' }}
                    </button>
                </div>
            </div>
        </Transition>

        <!-- 删除确认弹窗 -->
        <Transition name="slide-up">
            <div v-if="deleteDialogVisible" class="modal-panel modal-sm">
                <div class="modal-header">
                    <h3>确认删除</h3>
                    <button class="modal-close" @click="deleteDialogVisible = false">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-hint">
                        确定要删除用户
                        <strong>{{ deleteTarget?.name }}</strong> 吗？此操作不可恢复。
                    </p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="deleteDialogVisible = false">取消</button>
                    <button class="btn-danger" :disabled="deleteLoading" @click="handleDelete">
                        {{ deleteLoading ? '删除中...' : '确认删除' }}
                    </button>
                </div>
            </div>
        </Transition>
    </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
    getAdminUserList,
    createAdminUser,
    updateAdminUser,
    resetAdminUserPassword,
    deleteAdminUser,
    updateAdminUserAvatar,
    type AdminUserItem,
} from '@/api/admin/admin.api'
import { UserStore } from '@/store/modules/user'
import { SidebarStore } from '@/store/modules/sidebar'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { UserAvatar } from '@/components/user-avatar'
import {
    roleOptions,
    roleChoices,
    permChoices,
    pageSize,
    getRoleLabel,
    formatDate,
    buildCreateData,
    buildEditData,
    validateCreateForm,
    validateEditForm,
    validatePassword,
    initCreateForm,
    initEditForm,
} from './UserManagement'

// ==================== 权限检查 ====================
const router = useRouter()
const userStore = UserStore()
const sidebarStore = SidebarStore()

function toggleSidebar() {
    sidebarStore.toggle()
}

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
const totalCount = ref(0)

// ==================== 搜索与筛选 ====================
const searchKeyword = ref('')
const filterRole = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
    if (searchTimer) clearTimeout(searchTimer)
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
    } catch {
        ElMessage.error('获取用户列表失败')
    } finally {
        tableLoading.value = false
    }
}

// ==================== 弹窗控制 ====================
const createDialogVisible = ref(false)
const editDialogVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const showModal = computed(
    () =>
        createDialogVisible.value ||
        editDialogVisible.value ||
        resetPasswordDialogVisible.value ||
        deleteDialogVisible.value,
)

function closeModal() {
    createDialogVisible.value = false
    editDialogVisible.value = false
    resetPasswordDialogVisible.value = false
    deleteDialogVisible.value = false
}

// ==================== 创建用户 ====================
const createLoading = ref(false)
const createForm = reactive(initCreateForm())

function openCreateDialog() {
    Object.assign(createForm, initCreateForm())
    createDialogVisible.value = true
}

function onCreateAvatarFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (input.files && input.files[0]) {
        createForm.avatarFile = input.files[0]
        createForm.avatarPreview = URL.createObjectURL(input.files[0])
    }
}

function clearCreateAvatar() {
    createForm.avatarFile = null
    createForm.avatarPreview = ''
}

async function handleCreate() {
    const err = validateCreateForm(createForm)
    if (err) {
        ElMessage.error(err)
        return
    }
    createLoading.value = true
    try {
        const created = await createAdminUser(buildCreateData(createForm))
        let avatarUploadFailed = false

        // 创建接口与头像接口目前还是分开的：先建用户拿到 id，再按需补传头像。
        // 如果管理员没有选择头像，这里会自然跳过，不会创建任何头像记录。
        if (created?.id && createForm.avatarFile) {
            try {
                await updateAdminUserAvatar(created.id, createForm.avatarFile)
            } catch {
                avatarUploadFailed = true
            }
        }

        if (avatarUploadFailed) {
            ElMessage.warning('用户已创建，但头像上传失败')
        } else {
            ElMessage.success('用户创建成功')
        }
        createDialogVisible.value = false
        fetchUserList()
    } catch {
        ElMessage.error('创建用户失败')
    } finally {
        createLoading.value = false
    }
}

// ==================== 编辑用户 ====================
const editLoading = ref(false)
const editForm = reactive({
    id: 0,
    name: '',
    nickname: '',
    email: '',
    role: '',
    introduction: '',
    perm: 'public',
    avatarPreview: '',
    avatarFile: null as File | null,
})

function openEditDialog(user: AdminUserItem) {
    Object.assign(editForm, {
        ...initEditForm(user),
        avatarPreview: user.avatar || '',
        avatarFile: null,
    })
    editDialogVisible.value = true
}

function onAvatarFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (input.files && input.files[0]) {
        editForm.avatarFile = input.files[0]
        editForm.avatarPreview = URL.createObjectURL(input.files[0])
    }
}

async function handleEdit() {
    const err = validateEditForm(editForm)
    if (err) {
        ElMessage.error(err)
        return
    }
    editLoading.value = true
    try {
        // 如果有新头像，先上传
        if (editForm.avatarFile) {
            await updateAdminUserAvatar(editForm.id, editForm.avatarFile)
        }
        await updateAdminUser(editForm.id, buildEditData(editForm))
        ElMessage.success('用户信息更新成功')
        editDialogVisible.value = false
        fetchUserList()
    } catch {
        ElMessage.error('更新用户信息失败')
    } finally {
        editLoading.value = false
    }
}

// ==================== 重置密码 ====================
const resetPasswordLoading = ref(false)
const resetPasswordForm = reactive({ id: 0, name: '', password: '' })

function openResetPasswordDialog(user: AdminUserItem) {
    Object.assign(resetPasswordForm, { id: user.id, name: user.name, password: '' })
    resetPasswordDialogVisible.value = true
}

async function handleResetPassword() {
    const err = validatePassword(resetPasswordForm.password)
    if (err) {
        ElMessage.error(err)
        return
    }
    resetPasswordLoading.value = true
    try {
        await resetAdminUserPassword(resetPasswordForm.id, resetPasswordForm.password)
        ElMessage.success('密码重置成功')
        resetPasswordDialogVisible.value = false
    } catch {
        ElMessage.error('重置密码失败')
    } finally {
        resetPasswordLoading.value = false
    }
}

// ==================== 删除用户 ====================
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
    } catch {
        ElMessage.error('删除用户失败')
    } finally {
        deleteLoading.value = false
    }
}
</script>
<style scoped lang="scss" src="./UserManagement.scss"></style>
