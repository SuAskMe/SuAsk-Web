<script setup lang="ts">
import { computed, ref } from "vue";
import { getImgStyle, getTimeStr } from "../bubble-card";
import { MdPreview } from "md-editor-v3";
import SvgIcon from "@/components/svg-icon";
import "md-editor-v3/lib/preview.css";
interface BubbleCardProps {
    title: string;
    text: string;
    views: number;
    timeStamp: number;
    width?: string;
    isMarkdown?: boolean;
    showAllMarkdown?: boolean;
    hasNews?: boolean;
    showPin?: boolean;
    isPinned?: boolean;
    bubbleKey?: any;
    imageUrls?: string[];
    showFavorite?: boolean;
    isFavorite?: boolean;
    tag?: string;
    clickCard?: (key: any) => void;
    clickPin?: (key: any) => void;
    clickFavorite?: (key: any) => void;
}
const props = defineProps<BubbleCardProps>();
const timeStr = computed(() => getTimeStr(props.timeStamp));
const key = computed(() => (props.bubbleKey ? props.bubbleKey : null));
const containerStyle = computed(() => {
    return { width: props.width ? props.width : "450px" };
});
const imageContainer = computed(() =>
    getImgStyle(props.imageUrls, props.width)
);
const tagStyle = computed(() => {
    switch (props.tag) {
        case "置顶":
            return { border: "solid 1px #ffc107", color: "#ffc107" };
        case "未回复":
            return { border: "solid 1px #808080", color: "#808080" };
        case "已回复":
            return { border: "solid 1px #71b6ff", color: "#71b6ff" };
        default:
            return { border: "solid 1px #808080", color: "#808080" };
    }
});
</script>

<template>
    <div class="card-container" @click.stop="clickCard(key)" :style="containerStyle">
        <div v-if="showPin" @click.stop="clickPin(key)" class="pin" :data-tips="isPinned ? '取消置顶' : '置顶'">
            <!-- <svg-icon
                icon="pushpin"
                size="20"
                :color="isPinned ? '#FFC107' : '#818181'"
                :hover-color="isPinned ? '#FFC107' : '#818181'"
                :filled="isPinned"
            /> -->
            <svg :width="20" :height="20" :color="isPinned ? '#FFC107' : '#808080'"
                :fill="isPinned ? '#FFC107' : '#808080'">
                <use :href="`#icon-pushpin${isPinned ? '-fill' : ''}`"></use>
            </svg>
        </div>
        <div class="card-body">
            <div v-if="hasNews" class="news-dot"></div>
            <div class="q-title">{{ title }}</div>
            <div class="q-body">
                <div v-if="!isMarkdown" class="text">{{ text }}</div>
                <div v-else :class="'md-container' + (showAllMarkdown ? '-all' : '')">
                    <MdPreview id="preview-only" :model-value="text" class="md-preview" />
                </div>
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
            <div class="q-footer">
                <div v-if="tag !== undefined" class="tag" :style="tagStyle">
                    {{ tag }}
                </div>
                <div class="looks">
                    <svg-icon icon="eye" size="16" color="#818181" />
                    <span class="counts">{{ views }}</span>
                </div>
                <div class="time">{{ timeStr }}</div>
                <svg-icon v-if="showFavorite" icon="bookmark" size="18" :color="isFavorite ? '#ffc107' : '#818181'"
                    :hover-color="isFavorite ? '#ffc107' : '#71b6ff'" :filled="isFavorite" style="cursor: pointer"
                    @click.stop="clickFavorite(key)" />
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleCard.scss"></style>
