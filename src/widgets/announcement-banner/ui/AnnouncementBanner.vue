<template>
    <Transition name="banner-fade">
        <div v-if="visible" class="announcement-banner" @click="navigateToList">
            <span class="banner-icon">📢</span>
            <span class="banner-text">{{ announcement?.title }}</span>
            <button class="banner-dismiss" @click.stop="dismiss" title="关闭">&times;</button>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getActiveAnnouncement } from '@/entities/announcement'
import type { ActiveAnnouncementRes } from '@/entities/announcement'
import { UserStore } from '@/app/store/modules/user'
import {
    ANNOUNCEMENT_DISMISSED_STORAGE_KEY,
    ANNOUNCEMENT_LIST_PATH,
} from '@/entities/announcement'

const router = useRouter()
const userStore = UserStore()
const cacheTtlMs = 60 * 1000

const announcement = ref<ActiveAnnouncementRes['announcement']>(null)
const dismissedId = ref<number>(0)
const lastFetchedAt = ref(0)
let activeRequest: Promise<void> | null = null

const visible = computed(
    () => !!userStore.token && !!announcement.value && announcement.value.id !== dismissedId.value,
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
    if (!userStore.token) {
        announcement.value = null
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

function dismiss() {
    if (announcement.value) {
        localStorage.setItem(ANNOUNCEMENT_DISMISSED_STORAGE_KEY, String(announcement.value.id))
        dismissedId.value = announcement.value.id
    }
}

function navigateToList() {
    router.push(ANNOUNCEMENT_LIST_PATH)
}

onMounted(() => fetchActive(true))
watch(
    () => userStore.token,
    () => fetchActive(true),
)
</script>

<style scoped lang="scss">
.announcement-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #e8f4fd, #dceeff);
    border: 1px solid #b3d9ff;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: linear-gradient(135deg, #dceeff, #cce4ff);
    }
}

.banner-icon {
    font-size: 16px;
    flex-shrink: 0;
}

.banner-text {
    flex: 1;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.banner-dismiss {
    flex-shrink: 0;
    background: none;
    border: none;
    font-size: 18px;
    color: #999;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;

    &:hover {
        color: #666;
    }
}

.banner-fade-enter-active,
.banner-fade-leave-active {
    transition: all 0.3s ease;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 0;
}
</style>
