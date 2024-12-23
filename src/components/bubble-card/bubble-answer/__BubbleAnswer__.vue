<script setup lang="ts">
import { getImgStyle, getTimeStr } from "../bubble-card";
import { computed } from "vue";
interface BubbleAnswerProps {
    isMine?: boolean;
    avatar: string;
    nickName: string;
    text: string;
    likeCount: number;
    timeStamp: number;
    width?: string;
    isLiked?: boolean;
    quote?: {
        text: string;
        author: string;
    };
    isTeacher?: boolean;
    teacherName?: string;
    imageUrls?: string[];
    bubbleKey?: any;
    clickAvatar?: (key: any) => void;
    clickLike?: (key: any) => void;
    clickQuote?: (key: any) => void;
    clickCard?: (key: any) => void;
}

const props = defineProps<BubbleAnswerProps>();

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
const containerStyle = computed(() => {
    let style1 = {
        marginRight: "12px",
        backgroundColor: "#e5f0fc",
        // alignItems: "flex-end",
        width: props.width ? props.width : "450px",
    };
    let style2 = {
        marginLeft: "12px",
        backgroundColor: "#fff",
        width: props.width ? props.width : "450px",
    };
    return props.isMine ? style1 : style2;
});
const imageContainer = computed(() =>
    getImgStyle(props.imageUrls, props.width)
);
</script>
<template>
    <div @click.stop="clickCard(key)" class="bubble-answer" :style="isMine ? 'flex-direction: row-reverse;' : ''">
        <img @click.stop="clickAvatar(key)" :src="avatar"
            onerror="this.src='/src/assets/default-avatar.png'; this.onerror=null;" class="avatar"
            :style="isMine ? 'margin-right: 24px;' : 'margin-left: 24px;'" />
        <div class="card-container" :style="containerStyle">
            <div class="ans-title">
                <div class="nickname">{{ nickName }}</div>
                <div v-if="isTeacher" class="suffixed-text">
                    {{ teacherName }}
                </div>
            </div>
            <div class="ans-body">
                <div v-if="Quote.hasQuote" class="quote-container" @click.stop="clickQuote(key)">
                    <div class="author">{{ Quote.author + ":" }}</div>
                    <div class="quote-text">{{ Quote.text }}</div>
                </div>
                <div class="text">{{ text }}</div>
                <div v-if="imageContainer.hasImages" class="photos-container">
                    <div class="preview-group" :style="{
                        width: imageContainer.containerWidth,
                        gap: imageContainer.gap + ' ' + imageContainer.gap,
                    }">
                        <el-image @click.stop v-for="(img, index) in imageUrls" :key="img" :src="img" :style="{
                            width: imageContainer.size,
                            height: imageContainer.size,
                            borderRadius: '6px',
                        }" :preview-src-list="imageUrls" :initial-index="index" fit="cover" lazy infinite
                            preview-teleported style="cursor: zoom-in"></el-image>
                    </div>
                </div>
            </div>
            <div class="ans-footer">
                <div class="looks">
                    <div class="like" :data-tips="isLiked ? '取消点赞' : '点赞'" @click.stop="clickLike(key)">
                        <svg-icon icon="heart" size="16" :color="isLiked ? '#FF5F96' : '#818181'" :filled="isLiked" />
                    </div>
                    <span class="counts">{{ likeCount }}</span>
                </div>
                <div class="time">{{ timeStr }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleAnswer.scss"></style>
