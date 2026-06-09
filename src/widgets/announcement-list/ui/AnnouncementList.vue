<template>
    <div class="announcement-list-widget" :class="{ compact }">
        <div class="locked-state" v-if="!canLoad">
            <p>{{ lockedMessage }}</p>
        </div>

        <div class="announcement-list" v-else-if="!loading && list.length > 0">
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
                </div>
                <MarkdownPreview class="card-content" :model-value="item.contents" />
                <CardMediaGrid v-if="item.image_urls?.length" :image-urls="item.image_urls" />
            </div>
        </div>

        <div class="loading-state" v-if="canLoad && loading">
            <p>加载中...</p>
        </div>

        <div class="empty-state" v-if="canLoad && !loading && list.length === 0">
            <p>暂无公告</p>
        </div>

        <div class="pagination" v-if="canLoad && totalCount > pageSize">
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
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getAnnouncementList } from '@/entities/announcement'
import type { AnnouncementItem } from '@/entities/announcement'
import MarkdownPreview from '@/shared/ui/markdown-preview'
import CardMediaGrid from '@/shared/ui/card-media-grid'

const props = withDefaults(
    defineProps<{
        canLoad?: boolean
        lockedMessage?: string
        compact?: boolean
    }>(),
    {
        canLoad: true,
        lockedMessage: '公告仅限登录用户查看',
        compact: false,
    },
)

const pageSize = 10
const list = ref<AnnouncementItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)

function formatTime(ts: number): string {
    if (!ts) return ''
    return new Date(ts).toLocaleString('zh-CN')
}

function resetList() {
    list.value = []
    totalCount.value = 0
    currentPage.value = 1
}

async function fetchList() {
    if (!props.canLoad) {
        resetList()
        return
    }
    loading.value = true
    try {
        const res = await getAnnouncementList(currentPage.value)
        if (res) {
            list.value = res.announcements || []
            totalCount.value = res.total || 0
        }
    } catch {
        list.value = []
        totalCount.value = 0
    } finally {
        loading.value = false
    }
}

function onPageChange(page: number) {
    currentPage.value = page
    fetchList()
}

onMounted(fetchList)
watch(
    () => props.canLoad,
    (canLoad) => {
        if (canLoad) {
            currentPage.value = 1
            fetchList()
        } else {
            resetList()
            loading.value = false
        }
    },
)
</script>

<style scoped lang="scss">
.announcement-list-widget {
    width: 100%;
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
.empty-state,
.locked-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 160px;
    color: #999;
    font-size: 14px;
    text-align: center;
}

.locked-state {
    padding: 24px;
    background: #f8fafc;
    border: 1px dashed #dbe3ef;
    border-radius: 12px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 20px 0 0;

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

.compact {
    .announcement-list {
        gap: 12px;
    }

    .announcement-card {
        padding: 16px;
        background: #fbfdff;
    }

    .card-title {
        font-size: 16px;
    }

    .loading-state,
    .empty-state,
    .locked-state {
        min-height: 120px;
    }
}

@media (max-width: 768px) {
    .announcement-card {
        padding: 16px;
    }

    .pagination {
        flex-wrap: wrap;
        gap: 10px;
    }
}
</style>
