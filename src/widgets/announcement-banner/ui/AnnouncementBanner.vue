<template>
    <Teleport to="body">
        <Transition name="announcement-modal-fade">
            <div v-if="visible" class="announcement-overlay" @click.self="markAsReadAndClose">
                <section class="announcement-modal" role="dialog" aria-modal="true">
                    <header class="modal-header">
                        <div>
                            <span class="eyebrow">置顶公告</span>
                            <h2>{{ announcement?.title }}</h2>
                        </div>
                        <button
                            class="modal-close"
                            type="button"
                            title="关闭"
                            @click="markAsReadAndClose"
                        >
                            &times;
                        </button>
                    </header>

                    <div class="modal-meta">
                        <span v-if="announcement?.author_name">{{ announcement.author_name }}</span>
                        <span
                            v-if="announcement?.author_name && announcement?.published_at"
                            class="meta-divider"
                        >
                            |
                        </span>
                        <span v-if="announcement?.published_at">{{
                            formatTime(announcement.published_at)
                        }}</span>
                    </div>

                    <div class="modal-body">
                        <MarkdownPreview :model-value="announcement?.contents" />
                        <CardMediaGrid
                            v-if="announcement?.image_urls?.length"
                            class="modal-images"
                            :image-urls="announcement.image_urls"
                        />
                    </div>

                    <footer class="modal-footer">
                        <button class="btn-secondary" type="button" @click="navigateToList">
                            查看公告中心
                        </button>
                        <button class="btn-primary" type="button" @click="markAsReadAndClose">
                            我知道了
                        </button>
                    </footer>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getActiveAnnouncement } from '@/entities/announcement'
import type { ActiveAnnouncementRes } from '@/entities/announcement'
import { UserStore } from '@/entities/user'
import { ANNOUNCEMENT_DISMISSED_STORAGE_KEY, HELP_ANNOUNCEMENTS_PATH } from '@/entities/announcement'
import MarkdownPreview from '@/shared/ui/markdown-preview'
import CardMediaGrid from '@/shared/ui/card-media-grid'

const router = useRouter()
const userStore = UserStore()
const cacheTtlMs = 60 * 1000

const announcement = ref<ActiveAnnouncementRes['announcement']>(null)
const dismissedId = ref<number>(0)
const lastFetchedAt = ref(0)
let activeRequest: Promise<void> | null = null

const visible = computed(
    () =>
        !!userStore.isLoggedIn() &&
        !!announcement.value &&
        announcement.value.is_pinned &&
        announcement.value.id !== dismissedId.value,
)

function getDismissedId(): number {
    try {
        const raw = localStorage.getItem(ANNOUNCEMENT_DISMISSED_STORAGE_KEY)
        return raw ? Number(raw) : 0
    } catch {
        return 0
    }
}

async function fetchActive(force = false) {
    if (!userStore.isLoggedIn()) {
        announcement.value = null
        dismissedId.value = 0
        return
    }
    dismissedId.value = getDismissedId()
    const now = Date.now()
    if (!force && announcement.value && now - lastFetchedAt.value < cacheTtlMs) {
        return
    }
    if (activeRequest) {
        return activeRequest
    }
    activeRequest = getActiveAnnouncement()
        .then((res) => {
            announcement.value = res?.announcement ?? null
            lastFetchedAt.value = Date.now()
        })
        .catch(() => {
            announcement.value = null
        })
        .finally(() => {
            activeRequest = null
        })
    return activeRequest
}

function markAsReadAndClose() {
    if (announcement.value) {
        localStorage.setItem(ANNOUNCEMENT_DISMISSED_STORAGE_KEY, String(announcement.value.id))
        dismissedId.value = announcement.value.id
    }
}

function navigateToList() {
    markAsReadAndClose()
    router.push(HELP_ANNOUNCEMENTS_PATH)
}

function formatTime(ts: number): string {
    if (!ts) return ''
    return new Date(ts).toLocaleString('zh-CN')
}

const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && visible.value) {
        markAsReadAndClose()
    }
}

onMounted(() => fetchActive(true))
watch(
    () => userStore.isLoggedIn(),
    () => fetchActive(true),
)
watch(
    visible,
    (isVisible) => {
        if (isVisible) {
            document.body.style.overflow = 'hidden'
            document.addEventListener('keydown', handleEscKey)
        } else {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleEscKey)
        }
    },
    { immediate: true },
)

onUnmounted(() => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped lang="scss">
.announcement-overlay {
    position: fixed;
    inset: 0;
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(15, 23, 42, 0.42);
    backdrop-filter: blur(4px);
}

.announcement-modal {
    display: flex;
    flex-direction: column;
    width: min(640px, 92vw);
    max-height: min(720px, 86vh);
    overflow: hidden;
    background: linear-gradient(180deg, #f8fbff 0%, #ffffff 42%);
    border: 1px solid rgba(113, 182, 255, 0.22);
    border-radius: 18px;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 26px 10px;

    h2 {
        margin: 6px 0 0;
        color: #1f2937;
        font-size: 22px;
        font-weight: 700;
        line-height: 1.35;
    }
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    color: var(--su-blue, #409eff);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(113, 182, 255, 0.12);
    border-radius: 999px;
}

.modal-close {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    color: #94a3b8;
    font-size: 24px;
    line-height: 1;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        color: #475569;
        background: rgba(15, 23, 42, 0.06);
    }
}

.modal-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 26px 16px;
    color: #94a3b8;
    font-size: 13px;
}

.meta-divider {
    color: #cbd5e1;
}

.modal-body {
    flex: 1;
    min-height: 120px;
    overflow-y: auto;
    padding: 18px 26px;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(255, 255, 255, 0.78);
}

.modal-images {
    margin-top: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 18px 26px 22px;
}

.btn-primary,
.btn-secondary {
    min-width: 108px;
    padding: 9px 16px;
    border-radius: 999px;
    font-size: 14px;
    cursor: pointer;
    transition:
        transform 0.15s ease,
        opacity 0.15s ease,
        background 0.15s ease;

    &:hover {
        transform: translateY(-1px);
    }
}

.btn-primary {
    color: #fff;
    background: var(--su-blue, #409eff);
    border: 1px solid var(--su-blue, #409eff);

    &:hover {
        opacity: 0.9;
    }
}

.btn-secondary {
    color: #475569;
    background: #fff;
    border: 1px solid #dbe3ef;

    &:hover {
        background: #f8fafc;
    }
}

.announcement-modal-fade-enter-active,
.announcement-modal-fade-leave-active {
    transition: opacity 0.22s ease;

    .announcement-modal {
        transition:
            transform 0.22s ease,
            opacity 0.22s ease;
    }
}

.announcement-modal-fade-enter-from,
.announcement-modal-fade-leave-to {
    opacity: 0;

    .announcement-modal {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
    }
}

@media (max-width: 768px) {
    .announcement-overlay {
        padding: 16px;
        align-items: flex-start;
        padding-top: max(28px, env(safe-area-inset-top));
    }

    .announcement-modal {
        width: 100%;
        max-height: calc(100vh - 56px);
        border-radius: 16px;
    }

    .modal-header {
        padding: 20px 18px 8px;

        h2 {
            font-size: 19px;
        }
    }

    .modal-meta {
        padding: 0 18px 14px;
    }

    .modal-body {
        padding: 16px 18px;
    }

    .modal-footer {
        flex-direction: column-reverse;
        padding: 16px 18px 20px;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
    }
}
</style>
