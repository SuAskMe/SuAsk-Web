<template>
    <section class="admin-page">
        <header class="admin-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>内容管理</h2>
        </header>

        <el-scrollbar class="admin-content">
            <!-- 工具栏 -->
            <div class="toolbar">
                <div class="search-box">
                    <svg-icon icon="search" color="#999" size="16px" />
                    <input
                        v-model="searchKeyword"
                        type="text"
                        placeholder="搜索问题、回答、用户或教师..."
                        @input="onSearchInput"
                    />
                    <span v-if="searchKeyword" class="clear-btn" @click="clearSearch">&times;</span>
                </div>

                <div class="filter-tabs">
                    <button
                        v-for="opt in statusOptions"
                        :key="opt.value"
                        type="button"
                        :class="['filter-tab', { active: statusFilter === opt.value }]"
                        @click="setStatusFilter(opt.value)"
                    >
                        {{ opt.label }}
                    </button>
                </div>
            </div>

            <!-- 问题列表 -->
            <div v-if="!loading && questionList.length > 0" class="question-list">
                <div
                    v-for="question in questionList"
                    :key="question.id"
                    :class="[
                        'question-card',
                        `status-${question.status}`,
                        { deleted: question.is_deleted },
                    ]"
                    @click="goDetail(question.id)"
                >
                    <div class="question-info">
                        <div class="question-detail">
                            <div class="question-title-row">
                                <h3 class="question-title">{{ question.title }}</h3>
                                <div class="question-badges">
                                    <span :class="['badge', `status-${question.status}`]">
                                        <span class="status-dot"></span>
                                        {{ getStatusLabel(question.status) }}
                                    </span>
                                    <span v-if="question.is_deleted" class="badge deleted-badge"
                                        >已删除</span
                                    >
                                    <span
                                        v-if="question.matched_answer_count"
                                        class="badge match-badge"
                                    >
                                        命中 {{ question.matched_answer_count }} 条回答
                                    </span>
                                </div>
                            </div>
                            <p class="question-summary">
                                {{ summarizeContent(question.contents) }}
                            </p>
                        </div>
                    </div>

                    <div class="question-meta">
                        <div class="meta-details">
                            <span class="meta-item">
                                <svg-icon icon="user" color="#8b96a8" size="13px" />
                                提问者：{{ getQuestionAuthorLabel(question) }}
                            </span>
                            <span class="meta-item">
                                <svg-icon icon="graduation-cap" color="#8b96a8" size="13px" />
                                教师：{{ getTeacherLabel(question) }}
                            </span>
                            <span class="meta-item">
                                <svg-icon icon="message" color="#8b96a8" size="13px" />
                                回答：{{ question.answer_count }}
                            </span>
                            <span class="meta-item">
                                <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                浏览：{{ question.views }}
                            </span>
                            <span class="meta-item time">{{
                                formatAdminTime(question.created_at)
                            }}</span>
                        </div>
                        <div class="question-actions">
                            <button
                                type="button"
                                class="action-btn view"
                                @click.stop="goDetail(question.id)"
                            >
                                查看
                            </button>
                            <button
                                type="button"
                                :class="['action-btn', question.is_deleted ? 'restore' : 'delete']"
                                @click.stop="
                                    question.is_deleted
                                        ? handleRestore(question)
                                        : openDeleteDialog(question)
                                "
                            >
                                {{ question.is_deleted ? '恢复' : '删除' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 加载中 -->
            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div v-if="!loading && questionList.length === 0" class="empty-state">
                <p>暂无问题数据</p>
            </div>

            <!-- 分页 -->
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

        <!-- 遮罩层 -->
        <Transition name="fade">
            <div
                v-if="deleteDialogVisible"
                class="modal-overlay"
                @click.self="deleteDialogVisible = false"
            ></div>
        </Transition>

        <!-- 删除确认弹窗 -->
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
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElMessageBox } from 'element-plus/es/components/message-box/index.mjs'
import QuestionHeader from '@/widgets/question-header'
import { SidebarStore } from '@/widgets/app-shell/model'
import { UserStore } from '@/entities/user'
import {
    deleteAdminQuestion,
    getAdminQuestionDetailPath,
    getAdminQuestionList,
    restoreAdminQuestion,
    type AdminQuestionItem,
} from '@/entities/admin-question'
import {
    type AdminQuestionListFilter,
    formatAdminTime,
    getQuestionAuthorLabel,
    getStatusLabel,
    getTeacherLabel,
    getTotalPages,
    pageSize,
    statusOptions,
    summarizeContent,
} from '../model'

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
const statusFilter = ref<AdminQuestionListFilter>('all')
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

function setStatusFilter(value: AdminQuestionListFilter) {
    statusFilter.value = value
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
            status: statusFilter.value,
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
    router.push(getAdminQuestionDetailPath(id))
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

async function handleRestore(question: AdminQuestionItem) {
    if (!question.is_deleted) return

    try {
        await ElMessageBox.confirm(
            `确定要恢复问题“${question.title}”吗？恢复后它会重新出现在正常列表中。`,
            '恢复确认',
            {
                confirmButtonText: '确认恢复',
                cancelButtonText: '取消',
                type: 'warning',
            },
        )
    } catch {
        return
    }

    try {
        await restoreAdminQuestion(question.id)
        ElMessage.success('问题已恢复')
        fetchQuestions()
    } catch {
        ElMessage.error('恢复问题失败')
    }
}
</script>

<style scoped lang="scss" src="./QuestionManagementPage.scss"></style>
