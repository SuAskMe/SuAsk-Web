<template>
    <el-container class="admin-content-page">
        <el-header class="admin-content-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>内容管理</h2>
        </el-header>

        <el-scrollbar class="admin-content-scroll">
            <div class="content-toolbar">
                <div class="search-box">
                    <svg-icon icon="search" color="#999" size="16px" />
                    <input
                        v-model="searchKeyword"
                        type="text"
                        placeholder="搜索问题、回答、用户或教师..."
                        @input="onSearchInput"
                    />
                    <button
                        v-if="searchKeyword"
                        type="button"
                        class="clear-btn"
                        aria-label="清空搜索"
                        @click="clearSearch"
                    >
                        &times;
                    </button>
                </div>

                <div class="filter-tabs">
                    <button
                        v-for="opt in statusOptions"
                        :key="opt.value || 'all-status'"
                        type="button"
                        :class="['filter-tab', { active: statusFilter === opt.value }]"
                        @click="setStatusFilter(opt.value)"
                    >
                        {{ opt.label }}
                    </button>
                </div>

                <div class="filter-tabs">
                    <button
                        v-for="opt in visibilityOptions"
                        :key="opt.value || 'all-visibility'"
                        type="button"
                        :class="['filter-tab', { active: visibilityFilter === opt.value }]"
                        @click="setVisibilityFilter(opt.value)"
                    >
                        {{ opt.label }}
                    </button>
                </div>

                <label class="include-deleted-toggle">
                    <input
                        v-model="includeDeleted"
                        type="checkbox"
                        @change="refreshFromFirstPage"
                    />
                    <span>包含已删除内容</span>
                </label>
            </div>

            <div v-if="!loading && questionList.length > 0" class="question-admin-list">
                <article
                    v-for="question in questionList"
                    :key="question.id"
                    :class="['question-admin-card', { deleted: question.is_deleted }]"
                    @click="goDetail(question.id)"
                >
                    <div class="question-card-main">
                        <div class="question-title-row">
                            <h3>{{ question.title }}</h3>
                            <div class="question-badges">
                                <span :class="['status-badge', question.status]">
                                    {{ getStatusLabel(question.status) }}
                                </span>
                                <span
                                    :class="['visibility-badge', { private: question.is_private }]"
                                >
                                    {{ getVisibilityLabel(question) }}
                                </span>
                                <span v-if="question.is_deleted" class="deleted-badge">已删除</span>
                                <span v-if="question.matched_answer_count" class="match-badge">
                                    命中 {{ question.matched_answer_count }} 条回答
                                </span>
                            </div>
                        </div>

                        <p class="question-summary">
                            {{ summarizeContent(question.contents) }}
                        </p>

                        <div class="question-meta-grid">
                            <span>提问者：{{ getQuestionAuthorLabel(question) }}</span>
                            <span>目标教师：{{ getTeacherLabel(question) }}</span>
                            <span>回答：{{ question.answer_count }}</span>
                            <span>浏览：{{ question.views }}</span>
                            <span>创建：{{ formatAdminTime(question.created_at) }}</span>
                        </div>
                    </div>

                    <div class="question-card-actions">
                        <button
                            type="button"
                            class="action-btn view"
                            @click.stop="goDetail(question.id)"
                        >
                            查看
                        </button>
                        <button
                            type="button"
                            class="action-btn delete"
                            :disabled="question.is_deleted"
                            @click.stop="openDeleteDialog(question)"
                        >
                            删除
                        </button>
                    </div>
                </article>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <div v-if="!loading && questionList.length === 0" class="empty-state">
                <p>暂无问题数据</p>
            </div>

            <div v-if="totalCount > pageSize" class="pagination">
                <button
                    type="button"
                    class="page-btn"
                    :disabled="currentPage <= 1"
                    @click="onPageChange(currentPage - 1)"
                >
                    ‹
                </button>
                <span class="page-info">{{ currentPage }} / {{ getTotalPages(totalCount) }}</span>
                <button
                    type="button"
                    class="page-btn"
                    :disabled="currentPage >= getTotalPages(totalCount)"
                    @click="onPageChange(currentPage + 1)"
                >
                    ›
                </button>
                <span class="page-total">共 {{ totalCount }} 条</span>
            </div>
        </el-scrollbar>

        <Transition name="fade">
            <div
                v-if="deleteDialogVisible"
                class="modal-overlay"
                @click.self="deleteDialogVisible = false"
            ></div>
        </Transition>

        <Transition name="slide-up">
            <div v-if="deleteDialogVisible" class="modal-panel modal-sm">
                <div class="modal-header">
                    <h3>确认删除问题</h3>
                    <button type="button" class="modal-close" @click="deleteDialogVisible = false">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-hint">删除后该问题将从前台列表、详情和搜索结果中隐藏。</p>
                    <p class="delete-target-title">{{ deleteTarget?.title }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel" @click="deleteDialogVisible = false">
                        取消
                    </button>
                    <button
                        type="button"
                        class="btn-danger"
                        :disabled="deleteLoading"
                        @click="handleDelete"
                    >
                        {{ deleteLoading ? '删除中...' : '确认删除' }}
                    </button>
                </div>
            </div>
        </Transition>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { SidebarStore } from '@/store/modules/sidebar'
import { UserStore } from '@/store/modules/user'
import {
    deleteAdminQuestion,
    getAdminQuestionList,
    type AdminQuestionItem,
    type AdminQuestionStatus,
    type AdminQuestionVisibility,
} from '@/api/admin/admin.api'
import {
    formatAdminTime,
    getQuestionAuthorLabel,
    getStatusLabel,
    getTeacherLabel,
    getTotalPages,
    getVisibilityLabel,
    pageSize,
    statusOptions,
    summarizeContent,
    visibilityOptions,
} from './QuestionManagement'

const router = useRouter()
const userStore = UserStore()
const sidebarStore = SidebarStore()

function toggleSidebar() {
    sidebarStore.toggle()
}

const questionList = ref<AdminQuestionItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)
const searchKeyword = ref('')
const statusFilter = ref<'' | 'all' | AdminQuestionStatus>('')
const visibilityFilter = ref<'' | 'all' | AdminQuestionVisibility>('')
const includeDeleted = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
    if (userStore.getRole() !== 'admin') {
        router.replace('/')
        return
    }
    fetchQuestions()
})

function onSearchInput() {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(refreshFromFirstPage, 300)
}

function clearSearch() {
    searchKeyword.value = ''
    onSearchInput()
}

function setStatusFilter(value: '' | 'all' | AdminQuestionStatus) {
    statusFilter.value = value
    refreshFromFirstPage()
}

function setVisibilityFilter(value: '' | 'all' | AdminQuestionVisibility) {
    visibilityFilter.value = value
    refreshFromFirstPage()
}

function refreshFromFirstPage() {
    currentPage.value = 1
    fetchQuestions()
}

function onPageChange(page: number) {
    currentPage.value = page
    fetchQuestions()
}

async function fetchQuestions() {
    loading.value = true
    try {
        const res = await getAdminQuestionList({
            page: currentPage.value,
            keyword: searchKeyword.value || undefined,
            status: statusFilter.value || undefined,
            visibility: visibilityFilter.value || undefined,
            include_deleted: includeDeleted.value || undefined,
        })
        if (res) {
            questionList.value = res.list || []
            totalCount.value = res.total || 0
        }
    } catch {
        ElMessage.error('获取问题列表失败')
    } finally {
        loading.value = false
    }
}

function goDetail(id: number) {
    router.push(`/admin/questions/${id}`)
}

const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const deleteTarget = ref<AdminQuestionItem | null>(null)

function openDeleteDialog(question: AdminQuestionItem) {
    if (question.is_deleted) return
    deleteTarget.value = question
    deleteDialogVisible.value = true
}

async function handleDelete() {
    if (!deleteTarget.value) return
    deleteLoading.value = true
    try {
        await deleteAdminQuestion(deleteTarget.value.id)
        ElMessage.success('问题已删除')
        deleteDialogVisible.value = false
        fetchQuestions()
    } catch {
        ElMessage.error('删除问题失败')
    } finally {
        deleteLoading.value = false
    }
}
</script>

<style scoped lang="scss" src="./QuestionManagement.scss"></style>
