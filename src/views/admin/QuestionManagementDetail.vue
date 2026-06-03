<template>
    <section class="admin-page admin-question-detail-page">
        <header class="admin-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>问题详情</h2>
        </header>

        <el-scrollbar class="admin-content">
            <div class="toolbar detail-toolbar">
                <button type="button" class="back-btn" @click="router.push('/admin/questions')">
                    ← 返回列表
                </button>
                <div class="filter-group">
                    <span class="filter-group-label">回答删除状态</span>
                    <div class="filter-tabs">
                        <button
                            v-for="opt in deletedStatusOptions"
                            :key="opt.value"
                            type="button"
                            :class="['filter-tab', { active: deletedStatusFilter === opt.value }]"
                            @click="setDeletedStatusFilter(opt.value)"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <template v-else-if="question">
                <!-- 问题详情卡片 -->
                <section
                    :class="[
                        'question-card',
                        'question-detail-panel',
                        `status-${question.status}`,
                        { deleted: question.is_deleted },
                    ]"
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
                                </div>
                            </div>
                            <p class="question-full-content">{{ question.contents }}</p>
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
                                目标教师：{{ getTeacherLabel(question) }}
                            </span>
                            <span class="meta-item">
                                <svg-icon icon="message" color="#8b96a8" size="13px" />
                                回答：{{ question.answer_count }}
                            </span>
                            <span class="meta-item">
                                <svg-icon icon="eye" color="#8b96a8" size="13px" />
                                浏览：{{ question.views }}
                            </span>
                            <span class="meta-item time"
                                >创建：{{ formatAdminTime(question.created_at) }}</span
                            >
                            <span v-if="question.deleted_at" class="meta-item time"
                                >删除：{{ formatAdminTime(question.deleted_at) }}</span
                            >
                        </div>
                        <div class="question-actions">
                            <button
                                type="button"
                                :class="['action-btn', question.is_deleted ? 'restore' : 'delete']"
                                @click="
                                    question.is_deleted
                                        ? handleRestoreQuestion()
                                        : openDeleteQuestion()
                                "
                            >
                                {{ question.is_deleted ? '恢复问题' : '删除问题' }}
                            </button>
                        </div>
                    </div>
                </section>

                <!-- 回答列表 -->
                <section class="answer-section">
                    <div class="section-title-row">
                        <h3 class="section-title">回答列表</h3>
                        <span class="section-subtitle">{{ answers.length }} 条回答</span>
                    </div>

                    <div v-if="answers.length > 0" class="answer-list">
                        <article
                            v-for="answer in answers"
                            :key="answer.id"
                            :class="['answer-card', { deleted: answer.is_deleted }]"
                        >
                            <div class="answer-info">
                                <div class="answer-author-detail">
                                    <div class="answer-author-header">
                                        <span class="answer-author-name">
                                            {{
                                                answer.user_nickname ||
                                                answer.user_name ||
                                                '未知用户'
                                            }}
                                        </span>
                                        <span :class="['role-badge', `role-${answer.user_role}`]">{{
                                            getRoleLabel(answer.user_role)
                                        }}</span>
                                        <span v-if="answer.is_deleted" class="badge deleted-badge"
                                            >已删除</span
                                        >
                                    </div>
                                </div>
                                <div class="answer-actions">
                                    <button
                                        type="button"
                                        :class="[
                                            'action-btn',
                                            answer.is_deleted ? 'restore' : 'delete',
                                        ]"
                                        @click="
                                            answer.is_deleted
                                                ? handleRestoreAnswer(answer)
                                                : openDeleteAnswer(answer)
                                        "
                                    >
                                        {{ answer.is_deleted ? '恢复回答' : '删除回答' }}
                                    </button>
                                </div>
                            </div>

                            <p class="answer-content">{{ answer.contents }}</p>

                            <div class="answer-meta">
                                <div class="meta-details">
                                    <span class="meta-item"
                                        >创建：{{ formatAdminTime(answer.created_at) }}</span
                                    >
                                    <span class="meta-item">
                                        <svg-icon icon="heart" color="#8b96a8" size="12px" />
                                        点赞：{{ answer.upvotes }}
                                    </span>
                                    <span v-if="answer.in_reply_to" class="meta-item">
                                        <svg-icon
                                            icon="communicate_message"
                                            color="#8b96a8"
                                            size="12px"
                                        />
                                        回复 #{{ answer.in_reply_to }}
                                    </span>
                                    <span v-if="answer.deleted_at" class="meta-item time"
                                        >删除：{{ formatAdminTime(answer.deleted_at) }}</span
                                    >
                                </div>
                            </div>
                        </article>
                    </div>

                    <div v-else class="empty-state compact">
                        <p>暂无回答</p>
                    </div>
                </section>
            </template>

            <div v-else class="empty-state">
                <p>问题不存在</p>
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
                    <h3>
                        {{ deleteTarget?.type === 'question' ? '确认删除问题' : '确认删除回答' }}
                    </h3>
                    <button type="button" class="modal-close" @click="deleteDialogVisible = false">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-hint">
                        {{ deleteTargetHint }}
                    </p>
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
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElMessageBox } from 'element-plus/es/components/message-box/index.mjs'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { SidebarStore } from '@/store/modules/sidebar'
import { UserStore } from '@/store/modules/user'
import {
    deleteAdminQuestion,
    deleteAdminQuestionAnswer,
    getAdminQuestionDetail,
    restoreAdminQuestion,
    restoreAdminQuestionAnswer,
    type AdminDeletedStatusFilter,
    type AdminQuestionAnswerItem,
    type AdminQuestionItem,
} from '@/api/admin/admin.api'
import {
    deletedStatusOptions,
    formatAdminTime,
    getQuestionAuthorLabel,
    getRoleLabel,
    getStatusLabel,
    getTeacherLabel,
    summarizeContent,
} from './QuestionManagement'

defineOptions({
    name: 'QuestionManagementDetail',
})

type DeleteTarget =
    | { type: 'question'; id: number; title: string }
    | { type: 'answer'; id: number; title: string }

const route = useRoute()
const router = useRouter()
const userStore = UserStore()
const sidebarStore = SidebarStore()

const questionId = computed(() => Number(route.params.id))
const question = ref<AdminQuestionItem | null>(null)
const answers = ref<AdminQuestionAnswerItem[]>([])
const loading = ref(false)
const deletedStatusFilter = ref<AdminDeletedStatusFilter>('undeleted')
const lastFetchKey = ref('')

const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const deleteTarget = ref<DeleteTarget | null>(null)
const deleteTargetHint = computed(() => {
    if (deleteTarget.value?.type === 'question') {
        return '删除后该问题和下方回答将从前台隐藏。'
    }
    return '删除后该回答将从问题详情中隐藏，问题本身会保留。'
})

function toggleSidebar() {
    sidebarStore.toggle()
}

onMounted(() => {
    if (userStore.getRole() !== 'admin') {
        router.replace('/')
        return
    }
    fetchDetail(true)
})

onActivated(() => {
    fetchDetail()
})

watch(
    () => route.params.id,
    () => {
        fetchDetail(true)
    },
)

function setDeletedStatusFilter(value: AdminDeletedStatusFilter) {
    deletedStatusFilter.value = value
    fetchDetail(true)
}

async function fetchDetail(force = false) {
    const id = questionId.value
    if (!Number.isFinite(id) || id <= 0) {
        question.value = null
        answers.value = []
        return
    }
    if (userStore.getRole() !== 'admin') return

    const fetchKey = `${id}:${deletedStatusFilter.value}`
    if (!force && fetchKey === lastFetchKey.value && question.value) return
    lastFetchKey.value = fetchKey

    loading.value = true
    try {
        const res = await getAdminQuestionDetail(id, deletedStatusFilter.value)
        if (res) {
            question.value = res.question
            answers.value = res.answers || []
        }
    } catch {
        ElMessage.error('获取问题详情失败')
    } finally {
        loading.value = false
    }
}

function openDeleteQuestion() {
    if (!question.value || question.value.is_deleted) return
    deleteTarget.value = {
        type: 'question',
        id: question.value.id,
        title: question.value.title,
    }
    deleteDialogVisible.value = true
}

async function handleRestoreQuestion() {
    if (!question.value || !question.value.is_deleted) return

    try {
        await ElMessageBox.confirm(
            `确定要恢复问题“${question.value.title}”吗？恢复后它会重新出现在正常列表中。`,
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
        await restoreAdminQuestion(question.value.id)
        ElMessage.success('问题已恢复')
        await fetchDetail(true)
    } catch {
        ElMessage.error('恢复问题失败')
    }
}

function openDeleteAnswer(answer: AdminQuestionAnswerItem) {
    if (answer.is_deleted) return
    deleteTarget.value = {
        type: 'answer',
        id: answer.id,
        title: summarizeContent(answer.contents, 120),
    }
    deleteDialogVisible.value = true
}

async function handleRestoreAnswer(answer: AdminQuestionAnswerItem) {
    if (!answer.is_deleted) return

    try {
        await ElMessageBox.confirm(
            `确定要恢复这条回答吗？恢复后它会重新出现在问题详情中。`,
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
        await restoreAdminQuestionAnswer(questionId.value, answer.id)
        ElMessage.success('回答已恢复')
        await fetchDetail(true)
    } catch {
        ElMessage.error('恢复回答失败')
    }
}

async function handleDelete() {
    if (!deleteTarget.value) return
    deleteLoading.value = true
    try {
        if (deleteTarget.value.type === 'question') {
            await deleteAdminQuestion(deleteTarget.value.id)
            ElMessage.success('问题已删除')
            deleteDialogVisible.value = false
            await fetchDetail(true)
            return
        }

        await deleteAdminQuestionAnswer(questionId.value, deleteTarget.value.id)
        ElMessage.success('回答已删除')
        deleteDialogVisible.value = false
        await fetchDetail(true)
    } catch {
        ElMessage.error('删除失败')
    } finally {
        deleteLoading.value = false
    }
}
</script>

<style scoped lang="scss" src="./QuestionManagement.scss"></style>
