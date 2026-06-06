<template>
    <Teleport to="body">
        <Transition name="drawer-fade">
            <div v-if="modelValue" class="custom-drawer-container" @click.self="closeDrawer"></div>
        </Transition>
        <Transition name="drawer-slide">
            <div
                v-if="modelValue"
                class="custom-drawer"
                :style="{ width: isMobile ? '100%' : '400px' }"
            >
                <NotificationDialog
                    :question-count="questionCount"
                    :answer-count="answerCount"
                    :reply-count="replyCount"
                    :user_id="userId"
                    @close-drawer="closeDrawer"
                />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import NotificationDialog from '@/components/notification-dialog/NotificationDialog.vue'

const props = defineProps<{
    modelValue: boolean
    isMobile: boolean
    questionCount: number
    answerCount: number
    replyCount: number
    userId: number
}>()

const emit = defineEmits(['update:modelValue'])

function closeDrawer() {
    emit('update:modelValue', false)
}

const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.modelValue) {
        closeDrawer()
    }
}

watch(
    () => props.modelValue,
    (visible) => {
        // 抽屉打开时锁住 body 滚动，避免移动端出现“抽屉在滑，背景也在滑”的错位。
        if (visible) {
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
.custom-drawer-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(30px);
}

.custom-drawer {
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    background-color: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
    transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
    opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
    transition: transform 0.3s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
    transform: translateX(100%);
}
</style>
