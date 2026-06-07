<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { DeviceTypeStore } from '@/shared/model/device-type.store'
import { UserAvatar } from '@/shared/ui/user-avatar'
import { getTimeStr } from '../bubble-card'
import AnswerMetaRow from '../shared/AnswerMetaRow.vue'
import AnswerQuoteBlock from '../shared/AnswerQuoteBlock.vue'
import CardMediaGrid from '@/shared/ui/card-media-grid'
import { computed } from 'vue'
interface BubbleAnswerProps {
    isMine?: boolean
    avatar: string
    nickName: string
    text: string
    likeCount: number
    timeStamp: number
    width?: string
    isLiked?: boolean
    quote?: {
        text: string
        author: string
    }
    isTeacher?: boolean
    teacherName?: string
    imageUrls?: string[]
    bubbleKey?: any
    showDelete?: boolean
    clickAvatar?: (key: any) => void
    clickLike?: (key: any) => void
    clickQuote?: (key: any) => void
    clickCard?: (key: any) => void
    clickDelete?: (key: any) => void
}

const props = withDefaults(defineProps<BubbleAnswerProps>(), {
    showDelete: false,
    clickAvatar: () => {},
    clickLike: () => {},
    clickQuote: () => {},
    clickCard: () => {},
    clickDelete: () => {},
})

const quoteData = computed(() => {
    if (props.quote && props.quote.text && props.quote.author) {
        return {
            text: props.quote.text,
            author: props.quote.author,
        }
    }
    return null
})
const timeStr = computed(() => getTimeStr(props.timeStamp))
const key = computed(() => (props.bubbleKey ? props.bubbleKey : null))
const deviceType = DeviceTypeStore()
const containerStyle = computed(() => {
    const margin = deviceType.isMobile ? '2vw' : '12px'
    const width = props.width ? props.width : '450px'
    // 回答卡片的左右边距和底色都在这里切换，后续如果出现“本人回答跑到左侧”
    // 这类问题，优先先看 isMine 和这里的样式分支是否一致。
    const style1 = {
        marginRight: margin,
        backgroundColor: '#e5f0fc',
        // alignItems: "flex-end",
        width: width,
    }
    const style2 = {
        marginLeft: margin,
        backgroundColor: '#fff',
        width: width,
    }
    return props.isMine ? style1 : style2
})
const avatarMargin = computed(() => {
    const margin = props.isMine ? 'margin-right: 30px;' : 'margin-left: 24px;'
    // 移动端整体走居中布局，不再额外给头像预留桌面端边距。
    return deviceType.isMobile ? '' : margin
})
</script>
<template>
    <div
        class="bubble-answer"
        :style="{
            flexDirection: isMine ? 'row-reverse' : 'row',
            justifyContent: deviceType.isMobile ? 'center' : '',
        }"
    >
        <!-- <img
            @click.stop="clickAvatar(key)"
            :src="avatar"
            onerror="this.src='/src/assets/default-avatar.png'; this.onerror=null;"
            class="avatar"
            :style="isMine ? 'margin-right: 24px;' : 'margin-left: 24px;'"
        /> -->
        <UserAvatar
            @click.stop="clickAvatar(key)"
            :src="avatar"
            :name="nickName"
            :size="40"
            class="avatar"
            :style="avatarMargin"
        />
        <div class="card-container" :style="containerStyle" @click.stop="clickCard(key)">
            <div class="ans-title">
                <div class="nickname">{{ nickName }}</div>
                <div v-if="isTeacher" class="suffixed-text">
                    {{ '@' + teacherName }}
                </div>
            </div>
            <div class="ans-body">
                <AnswerQuoteBlock
                    v-if="quoteData"
                    :author="quoteData.author"
                    :text="quoteData.text"
                    @quote="clickQuote(key)"
                />
                <div class="text">{{ text }}</div>
                <CardMediaGrid :image-urls="imageUrls" :width="props.width" />
            </div>
            <AnswerMetaRow
                :like-count="likeCount"
                :is-liked="isLiked"
                :show-delete="showDelete"
                :time-label="timeStr"
                @like="clickLike(key)"
                @delete="clickDelete(key)"
            />
        </div>
    </div>
</template>

<style scoped src="./BubbleAnswer.scss"></style>
