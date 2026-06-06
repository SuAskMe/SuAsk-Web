<template>
    <section class="announcement-page">
        <header class="announcement-header">
            <QuestionHeader @sidebar="toggleSidebar" sidebar_btn />
            <h2>公告中心</h2>
        </header>

        <el-scrollbar class="announcement-content">
            <div class="announcement-list" v-if="!loading && list.length > 0">
                <div class="announcement-card" v-for="item in list" :key="item.id">
                    <div class="card-header">
                        <h3 class="card-title">
                            <span v-if="item.is_pinned" class="pin-badge">置顶</span>
                            {{ item.title }}
                        </h3>
                    </div>
                    <div class="card-meta">
                        <span>{{ item.author_name }}</span>
                        <span class="meta-divider">|</span>
                        <span>{{ formatTime(item.published_at) }}</span>
                        <span v-if="item.comment_cnt > 0" class="meta-divider">|</span>
                        <span v-if="item.comment_cnt > 0">{{ item.comment_cnt }} 条评论</span>
                    </div>
                    <MarkdownPreview class="card-content" :model-value="item.contents" />
                </div>
            </div>

            <div class="loading-state" v-if="loading">
                <p>加载中...</p>
            </div>

            <div class="empty-state" v-if="!loading && list.length === 0">
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
                <span class="page-total">共 {{ totalCount }} 项</span>
            </div>
        </el-scrollbar>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAnnouncementList } from '@/entities/announcement'
import type { AnnouncementItem } from '@/entities/announcement'
import { SidebarStore } from '@/store/modules/sidebar'
import QuestionHeader from '@/components/question-header/QuestionHeader.vue'
import MarkdownPreview from '@/shared/ui/markdown-preview'

const sidebarStore = SidebarStore()
const pageSize = 10

function toggleSidebar() {
    sidebarStore.toggle()
}

const list = ref<AnnouncementItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)

function formatTime(ts: number): string {
    if (!ts) return ''
    return new Date(ts).toLocaleString('zh-CN')
}

async function fetchList() {
    loading.value = true
    try {
        const res = await getAnnouncementList(currentPage.value)
        if (res) {
            list.value = res.announcements || []
            totalCount.value = res.total || 0
        }
    } catch {
        list.value = []
    } finally {
        loading.value = false
    }
}

function onPageChange(page: number) {
    currentPage.value = page
    fetchList()
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.announcement-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
}

.announcement-header {
    flex-shrink: 0;
    padding: 16px 20px 12px;

    h2 {
        margin: 8px 0 0;
        font-size: 22px;
        font-weight: 600;
        color: #1a1a1a;
    }
}

.announcement-content {
    flex: 1;
    padding: 0 20px 20px;
}

.announcement-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.announcement-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 20px;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}

.card-title {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
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

.card-meta {
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;

    .meta-divider {
        margin: 0 8px;
    }
}

.card-content {
    font-size: 14px;
    color: #555;
    line-height: 1.7;
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
</style>
