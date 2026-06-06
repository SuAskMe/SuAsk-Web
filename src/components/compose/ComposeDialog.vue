<template>
    <div>
        <transition name="fade" mode="out-in">
            <div class="overlay" @click.stop="close" v-if="composeDialogStore.visible" />
        </transition>
        <transition name="dialog" mode="out-in" v-if="props.type === 'ask'">
            <AskDialog
                class="post-compose"
                v-if="composeDialogStore.visible"
                ref="dialogRef"
                @question-posted="handleQuestionPosted"
            />
        </transition>
        <transition name="dialog" mode="out-in" v-if="props.type === 'answer'">
            <AnswerDialog
                class="post-compose"
                v-if="composeDialogStore.visible"
                ref="dialogRef"
                @answer-posted="handleAnswerPosted"
            />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ComposeDialogStore } from '@/store/modules/compose-dialog'
import { defineAsyncComponent, ref } from 'vue'
import type { QuestionItem } from '@/model/question.model'
import type { AnswerItem } from '@/entities/answer'

const AskDialog = defineAsyncComponent(() => import('./AskDialog.vue'))
const AnswerDialog = defineAsyncComponent(() => import('./AnswerDialog.vue'))

const composeDialogStore = ComposeDialogStore()

const dialogRef = ref<{
    closeDialog: () => void
} | null>(null)

function close() {
    dialogRef.value?.closeDialog()
}

const emit = defineEmits(['question-posted', 'answer-posted'])

function handleQuestionPosted(question: QuestionItem) {
    emit('question-posted', question)
}

function handleAnswerPosted(answer: AnswerItem) {
    emit('answer-posted', answer)
}

const props = defineProps<{
    type: 'ask' | 'answer'
}>()
</script>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.25);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    z-index: 99;
}

.post-compose {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background-color: #fff;
    padding: 24px;
    box-shadow:
        0 20px 60px -12px rgba(15, 23, 42, 0.12),
        0 10px 25px -5px rgba(15, 23, 42, 0.06),
        0 0 0 1px rgba(113, 182, 255, 0.12);
    border-radius: 24px;
    width: 600px;
    box-sizing: border-box;
    transition:
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.3s ease;

    @media (max-width: 768px) {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        height: 100dvh;
        max-height: 100dvh;
        border-radius: 0;
        transform: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        box-shadow: none;
        transition:
            transform 0.35s cubic-bezier(0.32, 0.94, 0.6, 1),
            opacity 0.35s ease;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.dialog-enter-active,
.dialog-leave-active {
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.3s ease;

    @media (max-width: 768px) {
        transition:
            transform 0.35s cubic-bezier(0.32, 0.94, 0.6, 1),
            opacity 0.35s ease;
    }
}

.dialog-enter-from,
.dialog-leave-to {
    transform: translate(-50%, -50%) translateY(30px);
    opacity: 0;

    @media (max-width: 768px) {
        transform: translateY(100%);
        opacity: 0.8;
    }
}

.dialog-enter-to,
.dialog-leave-from {
    transform: translate(-50%, -50%) translateY(0);
    opacity: 1;

    @media (max-width: 768px) {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
