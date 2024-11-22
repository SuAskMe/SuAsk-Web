<script setup lang="ts">
import { getImgStyle, getTimeStr } from "../bubble-card";
import { computed } from "vue";
interface BubbleAnswerProps {
    isMine: boolean;
    avatar: string;
    nickName: string;
    text: string;
    likeCount: number;
    timeStamp: number;
    isLiked?: boolean;
    quote?: {
        text: string;
        author: string;
    };
    imageUrls?: string[];
    bubbleKey?: any;
    clickAvatar?: (key: any) => void;
    clickLike?: (key: any) => void;
    clickQuote?: (key: any) => void;
}

const props = defineProps<BubbleAnswerProps>();

const imageContainer = computed(() => getImgStyle(props.imageUrls));
const Quote = computed(() =>
    props.quote && props.quote.text && props.quote.author
        ? {
              hasQuote: true,
              text: props.quote.text,
              author: props.quote.author,
          }
        : { hasQuote: false }
);
const timeStr = computed(() => getTimeStr(props.timeStamp));
const key = computed(() => (props.bubbleKey ? props.bubbleKey : null));
</script>
<template>
    <div
        class="bubble-answer"
        :style="isMine ? 'flex-direction: row-reverse;' : ''"
    >
        <img
            @click.stop="clickAvatar(key)"
            :src="avatar"
            onerror="this.src='/src/assets/default-avatar.png'; this.onerror=null;"
            class="avatar"
            :style="isMine ? 'margin-right: 72px;' : 'margin-left: 24px;'"
        />
        <div
            class="card-container"
            :style="
                isMine
                    ? 'margin-right: 12px; background-color: #e5f0fc; align-items: flex-end;'
                    : 'margin-left: 12px;'
            "
        >
            <div class="ans-title">{{ nickName }}</div>
            <div class="ans-body">
                <div
                    v-if="Quote.hasQuote"
                    class="quote-container"
                    @click.stop="clickQuote(key)"
                >
                    <div class="author">{{ Quote.author + ":" }}</div>
                    <div class="quote-text">{{ Quote.text }}</div>
                </div>
                <div class="text">{{ text }}</div>
                <div v-if="imageContainer.hasImages" class="photos-container">
                    <div
                        class="preview-group"
                        :style="{ width: imageContainer.containerWidth + 'px' }"
                    >
                        <a-image-preview-group infinite>
                            <a-image
                                @click.stop
                                v-for="(img, index) in imageUrls"
                                :key="index"
                                :src="img"
                                :width="imageContainer.size"
                                :height="imageContainer.size"
                                fit="cover"
                                show-loader
                                style="cursor: zoom-in; z-index: 9"
                            ></a-image>
                        </a-image-preview-group>
                    </div>
                </div>
            </div>
            <div class="ans-footer">
                <div class="looks">
                    <div
                        class="like"
                        :data-tips="isLiked ? '取消点赞' : '点赞'"
                        @click.stop="clickLike(key)"
                    >
                        <svg-icon
                            icon="heart"
                            size="16"
                            :color="isLiked ? '#FF5F96' : '#818181'"
                            :filled="isLiked"
                        />
                    </div>
                    <span class="counts">{{ likeCount }}</span>
                </div>
                <div class="time">{{ timeStr }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleAnswer.css"></style>
