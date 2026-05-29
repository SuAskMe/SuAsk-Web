<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed } from 'vue'
import { getTimeStr } from '../bubble-card'
import CardMediaGrid from '../shared/CardMediaGrid.vue'
import CardMetaRow from '../shared/CardMetaRow.vue'
import QuestionCardFooter from '../shared/QuestionCardFooter.vue'
import MarkdownPreview from '@/components/markdown-preview'

interface BubbleQuestionProps {
    title: string
    text: string
    views: number
    timeStamp: number
    width?: string
    isMarkdown?: boolean
    showAllMarkdown?: boolean
    bubbleKey?: any
    answerNum?: number
    imageUrls?: string[]
    avatars?: string[]
    isFavorite?: boolean
    showFavorite?: boolean
    showDelete?: boolean
    clickCard?: (key: any) => void
    clickFavorite?: (key: any) => void
    clickFooter?: (key: any) => void
    clickDelete?: (key: any) => void
}
const props = withDefaults(defineProps<BubbleQuestionProps>(), {
    showFavorite: true,
    showDelete: false,
    clickCard: () => {},
    clickFavorite: () => {},
    clickFooter: () => {},
    clickDelete: () => {},
})
const timeStr = computed(() => getTimeStr(props.timeStamp))
const key = computed(() => {
    return props.bubbleKey !== undefined ? props.bubbleKey : null
})
const containerStyle = computed(() => {
    return { width: props.width ? props.width : '450px' }
})

// const showDefaultAvatar = (index: number) => {
//     if (props.avatars && props.avatars[index]) {
//         props.avatars[index] = '/src/assets/default-avatar.png'
//     }
// }
</script>

<template>
    <div class="bubble-question">
        <div class="card-container" @click.stop="clickCard(key)">
            <div class="card-body" :style="containerStyle">
                <div class="q-title">{{ title }}</div>
                <div class="q-body">
                    <div v-if="!isMarkdown" class="text">{{ text }}</div>
                    <div v-else :class="'md-container' + (showAllMarkdown ? '-all' : '')">
                        <MarkdownPreview :model-value="text" class="md-preview" />
                    </div>
                    <CardMediaGrid :image-urls="imageUrls" :width="props.width" />
                </div>
                <CardMetaRow :views="views" :time-label="timeStr" />
            </div>
            <QuestionCardFooter
                :answer-num="answerNum"
                :avatars="avatars"
                :show-delete="showDelete"
                :show-favorite="showFavorite"
                :is-favorite="isFavorite"
                @favorite="clickFavorite(key)"
                @delete="clickDelete(key)"
                @footer="clickFooter(key)"
            />
        </div>
    </div>
</template>

<style scoped src="./BubbleQuestion.scss"></style>
