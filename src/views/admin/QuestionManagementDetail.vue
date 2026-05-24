<template>
    <el-container class="admin-content-page admin-question-detail-page">
        <el-header class="admin-content-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>问题详情</h2>
        </el-header>

        <el-scrollbar class="admin-content-scroll">
            <div class="detail-toolbar">
                <button type="button" class="back-btn" @click="router.push('/admin/questions')">
                    ← 返回列表
                </button>
                <label class="include-deleted-toggle">
                    <input v-model="includeDeleted" type="checkbox" @change="fetchDetail(true)" />
                    <span>包含已删除回答</span>
                </label>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <template v-else-if="question">
                <section :class="['question-detail-panel', { deleted: question.is_deleted }]">
                    <div class="question-title-row">
                        <h3>{{ question.title }}</h3>
                        <div class="question-badges">
                            <span :class="['status-badge', question.status]">
                                {{ getStatusLabel(question.status) }}
                            </span>
                            <span :class="['visibility-badge', { private: question.is_private }]">
                                {{ getVisibilityLabel(question) }}
                            </span>
                            <span v-if="question.is_deleted" class="deleted-badge">已删除</span>
                        </div>
                    </div>

                    <p class="question-full-content">{{ question.contents }}</p>

                    <div class="question-meta-grid">
                        <span>提问者：{{ getQuestionAuthorLabel(question) }}</span>
                        <span>目标教师：{{ getTeacherLabel(question) }}</span>
                        <span>回答：{{ question.answer_count }}</span>
                        <span>浏览：{{ question.views }}</span>
                        <span>创建：{{ formatAdminTime(question.created_at) }}</span>
                        <span v-if="question.deleted_at"
                            >删除：{{ formatAdminTime(question.deleted_at) }}</span
                        >
                    </div>

                    <div class="detail-actions">
                        <button
                            type="button"
                            class="action-btn delete"
                            :disabled="question.is_deleted"
                            @click="openDeleteQuestion"
                        >
                            删除问题
                        </button>
                    </div>
                </section>

                <section class="answer-section">
                    <div class="section-title-row">
                        <h3>回答</h3>
                        <span>{{ answers.length }} 条</span>
                    </div>

                    <div v-if="answers.length > 0" class="answer-admin-list">
                        <article
                            v-for="answer in answers"
                            :key="answer.id"
                            :class="['answer-admin-card', { deleted: answer.is_deleted }]"
                        >
                            <div class="answer-card-header">
                                <div class="answer-author">
                                    <span class="answer-author-name">
                                        {{
                                            answer.user_nickname ||
                                            answer.user_name ||
                                            '未知用户'
                                        }}
                                    </span>
                                    <span class="role-chip">{{
                                        getRoleLabel(answer.user_role)
                                    }}</span>
                                    <span v-if="answer.is_deleted" class="deleted-badge"
                                        >已删除</span
                                    >
                                </div>
                                <button
                                    type="button"
                                    class="action-btn delete"
                                    :disabled="answer.is_deleted"
                                    @click="openDeleteAnswer(answer)"
                                >
                                    删除回答
                                </button>
                            </div>

                            <p class="answer-content">{{ answer.contents }}</p>

                            <div class="answer-meta">
                                <span>创建：{{ formatAdminTime(answer.created_at) }}</span>
                                <span>点赞：{{ answer.upvotes }}</span>
                                <span v-if="answer.in_reply_to"
                                    >回复 #{{ answer.in_reply_to }}</span
                                >
                                <span v-if="answer.deleted_at"
                                    >删除：{{ formatAdminTime(answer.deleted_at) }}</span
                                >
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
    </el-container>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import { SidebarStore } from '@/store/modules/sidebar'
import { UserStore } from '@/store/modules/user'
import {
    deleteAdminQuestion,
    deleteAdminQuestionAnswer,
    getAdminQuestionDetail,
    type AdminQuestionAnswerItem,
    type AdminQuestionItem,
} from '@/api/admin/admin.api'
import {
    formatAdminTime,
    getQuestionAuthorLabel,
    getRoleLabel,
    getStatusLabel,
    getTeacherLabel,
    getVisibilityLabel,
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
const includeDeleted = ref(false)
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

async function fetchDetail(force = false) {
    const id = questionId.value
    if (!Number.isFinite(id) || id <= 0) {
        question.value = null
        answers.value = []
        return
    }
    if (userStore.getRole() !== 'admin') return

    const fetchKey = `${id}:${includeDeleted.value}`
    if (!force && fetchKey === lastFetchKey.value && question.value) return
    lastFetchKey.value = fetchKey

    loading.value = true
    try {
        const res = await getAdminQuestionDetail(id, includeDeleted.value)
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

function openDeleteAnswer(answer: AdminQuestionAnswerItem) {
    if (answer.is_deleted) return
    deleteTarget.value = {
        type: 'answer',
        id: answer.id,
        title: summarizeContent(answer.contents, 120),
    }
    deleteDialogVisible.value = true
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
