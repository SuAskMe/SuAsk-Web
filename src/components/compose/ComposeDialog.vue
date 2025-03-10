<template>
    <div>
        <transition name="fade" mode="out-in">
            <div class="overlay" @click.stop="close" v-if="composeDialogStore.visible" />
        </transition>
        <transition name="dialog" mode="out-in" v-if="props.type === 'ask'">
            <ask-dialog class="post-compose" v-if="composeDialogStore.visible" ref="dialogRef"
                @question-posted="handleQuestionPosted" />
        </transition>
        <transition name="dialog" mode="out-in" v-if="props.type === 'answer'">
            <answer-dialog class="post-compose" v-if="composeDialogStore.visible" ref="dialogRef"
                @answer-posted="handleAnswerPosted" />
        </transition>
    </div>
</template>

<script setup lang='ts'>
import { ComposeDialogStore } from '@/store/modules/compose-dialog';
import AskDialog from './AskDialog.vue';
import AnswerDialog from './AnswerDialog.vue';
import { ref } from 'vue';
import type { QuestionItem } from '@/model/question.model';
import type { AnswerItem } from '@/model/answer.model';

const composeDialogStore = ComposeDialogStore();

const dialogRef = ref<InstanceType<typeof AskDialog>>()

function close() {
    dialogRef.value?.closeDialog();
}

const emit = defineEmits(['question-posted', 'answer-posted']);

function handleQuestionPosted(question: QuestionItem) {
    emit('question-posted', question);
}

function handleAnswerPosted(answer: AnswerItem) {
    emit('answer-posted', answer);
}

const props = defineProps<{
    type: string
}>();
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(30px);
        z-index: 99;
    }

}


.post-compose {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    width: 600px;
    // max-width: 90%;

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
}


.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

.dialog-enter-active,
.dialog-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
    transform: translate(-50%, -50%) translateY(50px);
    opacity: 0;
}

.dialog-enter-to,
.dialog-leave-from {
    transform: translate(-50%, -50%) translateY(0);
    opacity: 1;
}
</style>