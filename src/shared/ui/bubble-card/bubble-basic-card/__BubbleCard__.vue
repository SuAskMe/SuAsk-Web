<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed } from 'vue'
import { getTimeStr } from '../bubble-card'
import CardMediaGrid from '@/shared/ui/card-media-grid'
import CardMetaRow from '../shared/CardMetaRow.vue'
import { DeviceTypeStore } from '@/shared/model/device-type.store'
import MarkdownPreview from '@/shared/ui/markdown-preview'

interface BubbleCardProps {
    title: string
    text: string
    views: number
    timeStamp: number
    width?: string
    isMarkdown?: boolean
    showAllMarkdown?: boolean
    hasNews?: boolean
    showPin?: boolean
    isPinned?: boolean
    bubbleKey?: any
    imageUrls?: string[]
    showFavorite?: boolean
    isFavorite?: boolean
    center?: boolean
    clickCard?: (key: any) => void
    clickPin?: (key: any) => void
    clickFavorite?: (key: any) => void
}
const props = withDefaults(defineProps<BubbleCardProps>(), {
    clickCard: () => {},
    clickPin: () => {},
    clickFavorite: () => {},
})
const timeStr = computed(() => getTimeStr(props.timeStamp))
const key = computed(() => (props.bubbleKey ? props.bubbleKey : null))
const deviceType = DeviceTypeStore()
const containerStyle = computed(() => {
    return {
        width: '100%',
        maxWidth: props.width ? props.width : '100%',
        marginLeft: props.center || deviceType.isMobile ? '0' : '24px',
    }
})
</script>

<template>
    <div
        class="bubble-card"
        :style="
            props.center || deviceType.isMobile
                ? { display: 'flex', flexDirection: 'column', alignItems: 'center' }
                : {}
        "
    >
        <div class="card-container" @click.stop="clickCard(key)" :style="containerStyle">
            <div
                v-if="showPin"
                @click.stop="clickPin(key)"
                class="pin"
                :data-tips="isPinned ? '取消置顶' : '置顶'"
            >
                <svg
                    :width="20"
                    :height="20"
                    :color="isPinned ? '#FFC107' : '#808080'"
                    :fill="isPinned ? '#FFC107' : '#808080'"
                >
                    <use :href="`#icon-pushpin${isPinned ? '-fill' : ''}`"></use>
                </svg>
            </div>
            <div v-else-if="isPinned" class="pin-static">
                <svg :width="20" :height="20" color="#FFC107" fill="#FFC107">
                    <use href="#icon-pushpin-fill"></use>
                </svg>
            </div>
            <div class="card-body">
                <div v-if="hasNews" class="news-dot"></div>
                <div class="q-title">{{ title }}</div>
                <div class="q-body">
                    <div v-if="!isMarkdown" class="text">{{ text }}</div>
                    <div v-else :class="'md-container' + (showAllMarkdown ? '-all' : '')">
                        <MarkdownPreview :model-value="text" class="md-preview" />
                    </div>
                    <CardMediaGrid :image-urls="imageUrls" :width="props.width" />
                </div>
                <CardMetaRow
                    :views="views"
                    :time-label="timeStr"
                    :show-favorite="showFavorite"
                    :is-favorite="isFavorite"
                    @favorite="clickFavorite(key)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleCard.scss"></style>
