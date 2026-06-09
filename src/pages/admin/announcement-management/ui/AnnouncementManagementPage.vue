<template>
    <section class="admin-page">
        <header class="admin-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>公告管理</h2>
        </header>

        <el-scrollbar class="admin-content">
            <div class="toolbar">
                <button class="btn-create" @click="openCreateDialog">
                    <span class="plus">+</span> 创建公告
                </button>
            </div>

            <div class="announcement-list" v-if="!tableLoading && announcementList.length > 0">
                <div class="announcement-card" v-for="item in announcementList" :key="item.id">
                    <div class="card-header">
                        <h3 class="card-title">
                            <span v-if="item.is_pinned" class="pin-badge">置顶</span>
                            {{ item.title }}
                        </h3>
                        <div class="card-actions">
                            <button class="action-btn edit" @click="openEditDialog(item)">
                                编辑
                            </button>
                            <button class="action-btn delete" @click="openDeleteDialog(item)">
                                删除
                            </button>
                        </div>
                    </div>
                    <div class="card-meta">
                        <span>{{ item.author_name }}</span>
                        <span class="meta-divider">|</span>
                        <span>{{ formatTime(item.published_at) }}</span>
                        <span class="meta-divider">|</span>
                        <span>{{ item.comment_cnt }} 条评论</span>
                    </div>
                    <MarkdownPreview
                        class="card-content"
                        :model-value="getPreview(item.contents)"
                    />
                    <CardMediaGrid v-if="item.image_urls?.length" :image-urls="item.image_urls" />
                </div>
            </div>

            <div class="loading-state" v-if="tableLoading">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <div class="empty-state" v-if="!tableLoading && announcementList.length === 0">
                <p>暂无公告</p>
            </div>

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

        <!-- 创建公告弹窗 -->
        <Transition name="slide-up">
            <div v-if="createDialogVisible" class="modal-panel">
                <div class="modal-header">
                    <h3>创建公告</h3>
                    <button class="modal-close" @click="closeCreateDialog">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>公告标题</label>
                        <input
                            v-model="createForm.title"
                            type="text"
                            placeholder="请输入公告标题"
                            maxlength="200"
                        />
                    </div>
                    <div class="form-group">
                        <label>公告内容</label>
                        <textarea
                            v-model="createForm.content"
                            placeholder="请输入公告内容（支持 Markdown）"
                            rows="6"
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input v-model="createForm.is_pinned" type="checkbox" />
                            置顶公告
                        </label>
                    </div>
                    <div class="form-group">
                        <label>过期时间（可选）</label>
                        <input v-model="createForm.expires_at" type="datetime-local" />
                    </div>
                    <div class="form-group">
                        <label>公告图片（可选，最多 8 张）</label>
                        <div class="image-upload-row">
                            <button
                                type="button"
                                class="image-upload-btn"
                                @click="pickCreateImages"
                            >
                                选择图片
                            </button>
                            <span class="image-hint">支持 jpg/png/gif/webp</span>
                        </div>
                        <input
                            ref="createImagePicker"
                            class="hidden-file-input"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                            multiple
                            @change="pickCreateImagesImpl"
                        />
                        <div class="image-preview-grid" v-if="createImagePreviews.length > 0">
                            <div
                                class="image-preview-item"
                                v-for="(img, index) in createImagePreviews"
                                :key="img.id"
                            >
                                <img :src="img.url" alt="公告图片预览" />
                                <button
                                    type="button"
                                    class="image-delete-btn"
                                    @click="deleteCreateImage(index)"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="closeCreateDialog">取消</button>
                    <button class="btn-confirm" :disabled="createLoading" @click="handleCreate">
                        {{ createLoading ? '创建中...' : '确认创建' }}
                    </button>
                </div>
            </div>
        </Transition>

        <!-- 编辑公告弹窗 -->
        <Transition name="slide-up">
            <div v-if="editDialogVisible" class="modal-panel">
                <div class="modal-header">
                    <h3>编辑公告</h3>
                    <button class="modal-close" @click="closeEditDialog">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>公告标题</label>
                        <input
                            v-model="editForm.title"
                            type="text"
                            placeholder="请输入公告标题"
                            maxlength="200"
                        />
                    </div>
                    <div class="form-group">
                        <label>公告内容</label>
                        <textarea
                            v-model="editForm.content"
                            placeholder="请输入公告内容（支持 Markdown）"
                            rows="6"
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input v-model="editForm.is_pinned" type="checkbox" />
                            置顶公告
                        </label>
                    </div>
                    <div class="form-group">
                        <label>过期时间（可选）</label>
                        <input v-model="editForm.expires_at" type="datetime-local" />
                    </div>
                    <div class="form-group">
                        <label>公告图片（可选，最多 8 张）</label>
                        <div class="image-upload-row">
                            <button
                                type="button"
                                class="image-upload-btn"
                                :disabled="editTotalImageCount >= maxImageCount"
                                @click="pickEditImages"
                            >
                                添加图片
                            </button>
                            <span class="image-hint">支持 jpg/png/gif/webp</span>
                        </div>
                        <input
                            ref="editImagePicker"
                            class="hidden-file-input"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                            multiple
                            @change="pickEditImagesImpl"
                        />
                        <div class="image-preview-grid" v-if="editExistingImages.length > 0">
                            <div
                                class="image-preview-item"
                                v-for="(img, index) in editExistingImages"
                                :key="img.id"
                            >
                                <img :src="img.url" alt="公告已有图片" />
                                <button
                                    type="button"
                                    class="image-delete-btn"
                                    @click="deleteExistingImage(index)"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                        <div class="image-preview-grid" v-if="editImagePreviews.length > 0">
                            <div
                                class="image-preview-item"
                                v-for="(img, index) in editImagePreviews"
                                :key="img.id"
                            >
                                <img :src="img.url" alt="公告新增图片预览" />
                                <button
                                    type="button"
                                    class="image-delete-btn"
                                    @click="deleteEditImage(index)"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="closeEditDialog">取消</button>
                    <button class="btn-confirm" :disabled="editLoading" @click="handleEdit">
                        {{ editLoading ? '保存中...' : '保存修改' }}
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
                        确定要删除公告
                        <strong>{{ deleteTarget?.title }}</strong> 吗？此操作不可恢复。
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
    </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import {
    getAdminAnnouncementList,
    getAnnouncementDetail,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '@/entities/announcement'
import type { AnnouncementImage, AnnouncementItem } from '@/entities/announcement'
import { UserStore } from '@/entities/user'
import { SidebarStore } from '@/widgets/app-shell/model'
import QuestionHeader from '@/widgets/question-header'
import MarkdownPreview from '@/shared/ui/markdown-preview'
import CardMediaGrid from '@/shared/ui/card-media-grid'
import {
    createObjectUrlPreview,
    revokeObjectUrlPreview,
    revokeObjectUrlPreviews,
    type ObjectUrlPreview,
} from '@/features/question-compose/objectUrlPreviews'

const router = useRouter()
const userStore = UserStore()
const sidebarStore = SidebarStore()
const pageSize = 10
const maxImageCount = 8
let previewId = 1

function toggleSidebar() {
    sidebarStore.toggle()
}

function formatTime(ts: number): string {
    if (!ts) return ''
    return new Date(ts).toLocaleString('zh-CN')
}

function toDatetimeLocal(ts: number): string {
    if (!ts) return ''
    const d = new Date(ts)
    const offsetMs = d.getTimezoneOffset() * 60 * 1000
    return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16)
}

function getPreview(content: string): string {
    if (!content) return ''
    const chars = Array.from(content)
    const preview = chars.slice(0, 200).join('')
    return chars.length > 200 ? `${preview}...` : preview
}

onMounted(() => {
    if (userStore.getRole() !== 'admin') {
        router.replace('/')
        return
    }
    fetchList()
})

onBeforeUnmount(() => {
    resetCreateImages()
    resetEditImages()
})

// ==================== 列表数据 ====================
const announcementList = ref<AnnouncementItem[]>([])
const tableLoading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)

async function fetchList() {
    tableLoading.value = true
    try {
        const res = await getAdminAnnouncementList(currentPage.value)
        if (res) {
            announcementList.value = res.announcements || []
            totalCount.value = res.total || 0
        }
    } catch {
        ElMessage.error('获取公告列表失败')
    } finally {
        tableLoading.value = false
    }
}

function onPageChange(page: number) {
    currentPage.value = page
    fetchList()
}

// ==================== 弹窗控制 ====================
const createDialogVisible = ref(false)
const editDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const showModal = computed(
    () => createDialogVisible.value || editDialogVisible.value || deleteDialogVisible.value,
)

function closeModal() {
    closeCreateDialog()
    closeEditDialog()
    deleteDialogVisible.value = false
}

// ==================== 创建公告 ====================
const createLoading = ref(false)
const createForm = reactive({
    title: '',
    content: '',
    is_pinned: false,
    expires_at: '',
})
const createImagePicker = ref<HTMLInputElement>()
const createFiles = ref<File[]>([])
const createImagePreviews = ref<ObjectUrlPreview[]>([])

function resetCreateImages() {
    revokeObjectUrlPreviews(createImagePreviews.value)
    createFiles.value = []
    createImagePreviews.value = []
    if (createImagePicker.value) {
        createImagePicker.value.value = ''
    }
}

function openCreateDialog() {
    Object.assign(createForm, { title: '', content: '', is_pinned: false, expires_at: '' })
    resetCreateImages()
    createDialogVisible.value = true
}

function closeCreateDialog() {
    createDialogVisible.value = false
    resetCreateImages()
}

function pickCreateImages() {
    createImagePicker.value?.click()
}

function pickCreateImagesImpl(event: Event) {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    if (createFiles.value.length + files.length > maxImageCount) {
        ElMessage.error(`最多只能上传${maxImageCount}张图片`)
        target.value = ''
        return
    }
    createFiles.value.push(...files)
    createImagePreviews.value.push(
        ...files.map((file) => createObjectUrlPreview(file, previewId++)),
    )
    target.value = ''
}

function deleteCreateImage(index: number) {
    revokeObjectUrlPreview(createImagePreviews.value[index])
    createFiles.value.splice(index, 1)
    createImagePreviews.value.splice(index, 1)
}

function buildCreateFormData() {
    const formData = new FormData()
    formData.append('title', createForm.title.trim())
    formData.append('content', createForm.content.trim())
    formData.append('is_pinned', String(createForm.is_pinned))
    formData.append('expires_at', createForm.expires_at || '')
    createFiles.value.forEach((file) => formData.append('files', file))
    return formData
}

async function handleCreate() {
    if (!createForm.title.trim()) {
        ElMessage.error('请输入公告标题')
        return
    }
    if (!createForm.content.trim()) {
        ElMessage.error('请输入公告内容')
        return
    }
    createLoading.value = true
    try {
        await createAnnouncement(buildCreateFormData())
        ElMessage.success('公告创建成功')
        closeCreateDialog()
        fetchList()
    } catch {
        ElMessage.error('创建公告失败')
    } finally {
        createLoading.value = false
    }
}

// ==================== 编辑公告 ====================
const editLoading = ref(false)
const editForm = reactive({
    id: 0,
    title: '',
    content: '',
    is_pinned: false,
    expires_at: '',
})
const editImagePicker = ref<HTMLInputElement>()
const editExistingImages = ref<AnnouncementImage[]>([])
const editFiles = ref<File[]>([])
const editImagePreviews = ref<ObjectUrlPreview[]>([])
const editTotalImageCount = computed(() => editExistingImages.value.length + editFiles.value.length)

function resetEditImages() {
    revokeObjectUrlPreviews(editImagePreviews.value)
    editExistingImages.value = []
    editFiles.value = []
    editImagePreviews.value = []
    if (editImagePicker.value) {
        editImagePicker.value.value = ''
    }
}

function closeEditDialog() {
    editDialogVisible.value = false
    resetEditImages()
}

function pickEditImages() {
    editImagePicker.value?.click()
}

function pickEditImagesImpl(event: Event) {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    if (editTotalImageCount.value + files.length > maxImageCount) {
        ElMessage.error(`最多只能上传${maxImageCount}张图片`)
        target.value = ''
        return
    }
    editFiles.value.push(...files)
    editImagePreviews.value.push(...files.map((file) => createObjectUrlPreview(file, previewId++)))
    target.value = ''
}

function deleteExistingImage(index: number) {
    editExistingImages.value.splice(index, 1)
}

function deleteEditImage(index: number) {
    revokeObjectUrlPreview(editImagePreviews.value[index])
    editFiles.value.splice(index, 1)
    editImagePreviews.value.splice(index, 1)
}

function buildEditFormData() {
    const formData = new FormData()
    formData.append('id', String(editForm.id))
    formData.append('title', editForm.title.trim())
    formData.append('content', editForm.content.trim())
    formData.append('is_pinned', String(editForm.is_pinned))
    formData.append('expires_at', editForm.expires_at || '')
    formData.append('sync_images', 'true')
    formData.append('keep_image_ids', JSON.stringify(editExistingImages.value.map((img) => img.id)))
    editFiles.value.forEach((file) => formData.append('files', file))
    return formData
}

async function openEditDialog(item: AnnouncementItem) {
    editLoading.value = true
    editDialogVisible.value = true
    resetEditImages()
    try {
        const detail = await getAnnouncementDetail(item.id)
        Object.assign(editForm, {
            id: detail.id,
            title: detail.title,
            content: detail.contents,
            is_pinned: detail.is_pinned,
            expires_at: toDatetimeLocal(detail.expires_at),
        })
        editExistingImages.value = detail.images || []
    } catch {
        closeEditDialog()
        ElMessage.error('获取公告详情失败')
    } finally {
        editLoading.value = false
    }
}

async function handleEdit() {
    if (!editForm.title.trim()) {
        ElMessage.error('请输入公告标题')
        return
    }
    if (!editForm.content.trim()) {
        ElMessage.error('请输入公告内容')
        return
    }
    editLoading.value = true
    try {
        await updateAnnouncement(buildEditFormData())
        ElMessage.success('公告更新成功')
        closeEditDialog()
        fetchList()
    } catch {
        ElMessage.error('更新公告失败')
    } finally {
        editLoading.value = false
    }
}

// ==================== 删除公告 ====================
const deleteLoading = ref(false)
const deleteTarget = ref<AnnouncementItem | null>(null)

function openDeleteDialog(item: AnnouncementItem) {
    deleteTarget.value = item
    deleteDialogVisible.value = true
}

async function handleDelete() {
    if (!deleteTarget.value) return
    deleteLoading.value = true
    try {
        await deleteAnnouncement(deleteTarget.value.id)
        ElMessage.success('公告删除成功')
        deleteDialogVisible.value = false
        fetchList()
    } catch {
        ElMessage.error('删除公告失败')
    } finally {
        deleteLoading.value = false
    }
}
</script>

<style scoped lang="scss">
.admin-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
}

.admin-header {
    flex-shrink: 0;
    padding: 16px 20px 12px;

    h2 {
        margin: 8px 0 0;
        font-size: 22px;
        font-weight: 600;
        color: #1a1a1a;
    }
}

.admin-content {
    flex: 1;
    padding: 0 20px 20px;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.btn-create {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    background: var(--su-blue, #409eff);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }

    .plus {
        font-size: 18px;
        line-height: 1;
    }
}

.announcement-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.announcement-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 18px 20px;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
}

.card-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    flex: 1;
}

.pin-badge {
    display: inline-block;
    padding: 1px 6px;
    margin-right: 6px;
    font-size: 11px;
    font-weight: 500;
    color: #fff;
    background: #e74c3c;
    border-radius: 4px;
    vertical-align: middle;
}

.card-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.action-btn {
    padding: 4px 10px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;

    &.edit:hover {
        border-color: var(--su-blue, #409eff);
        color: var(--su-blue, #409eff);
    }

    &.delete:hover {
        border-color: #e74c3c;
        color: #e74c3c;
    }
}

.card-meta {
    font-size: 13px;
    color: #999;
    margin-bottom: 10px;

    .meta-divider {
        margin: 0 8px;
    }
}

.card-content {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
    word-break: break-word;
}

.loading-state,
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #999;
    font-size: 14px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 20px 0;

    .page-btn {
        width: 32px;
        height: 32px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
        font-size: 16px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;

        &:disabled {
            color: #ccc;
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            border-color: var(--su-blue, #409eff);
            color: var(--su-blue, #409eff);
        }
    }

    .page-info {
        font-size: 14px;
        color: #666;
    }

    .page-total {
        font-size: 13px;
        color: #999;
    }
}

// Modal styles
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.3);
}

.modal-panel {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 101;
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    background: #fff;
    border-radius: 16px 16px 0 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-sm {
    max-width: 420px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
    }
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    line-height: 1;

    &:hover {
        color: #333;
    }
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}

.modal-hint {
    font-size: 14px;
    color: #666;
    margin: 0 0 16px;
    line-height: 1.6;
}

.form-group {
    margin-bottom: 16px;

    label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: #666;
        margin-bottom: 6px;
    }

    input[type='text'],
    input[type='datetime-local'],
    textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        font-size: 14px;
        color: #333;
        outline: none;
        box-sizing: border-box;
        font-family: inherit;
        transition: border-color 0.2s;

        &:focus {
            border-color: var(--su-blue, #409eff);
        }
    }

    textarea {
        resize: vertical;
        min-height: 100px;
    }
}

.checkbox-label {
    display: flex !important;
    align-items: center;
    gap: 6px;
    cursor: pointer;

    input[type='checkbox'] {
        width: auto;
        margin: 0;
    }
}

.hidden-file-input {
    display: none;
}

.image-upload-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.image-upload-btn {
    padding: 7px 14px;
    border: 1px solid var(--su-blue, #409eff);
    border-radius: 8px;
    background: #fff;
    color: var(--su-blue, #409eff);
    font-size: 13px;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.image-hint {
    color: #999;
    font-size: 12px;
}

.image-preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.image-preview-item {
    position: relative;
    width: 76px;
    height: 76px;
    overflow: hidden;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    background: #f8fafc;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
}

.image-delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.58);
    color: #fff;
    line-height: 18px;
    cursor: pointer;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1px solid #f0f0f0;
}

.btn-cancel {
    padding: 8px 20px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background: #fff;
    color: #666;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        border-color: #999;
    }
}

.btn-confirm {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: var(--su-blue, #409eff);
    color: #fff;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.btn-danger {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: #e74c3c;
    color: #fff;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateX(-50%) translateY(100%);
}
</style>
