<script setup lang="ts">
import { computed, ref } from "vue";
import { getImgStyle, getTimeStr } from "../bubble-card";
import { MdPreview } from "md-editor-v3";
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
    clickCard?: (key: any) => void;
    clickPin?: (key: any) => void;
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
</script>

<template>
    <div
        class="card-container"
        @click.stop="clickCard(key)"
        :style="containerStyle"
    >
        <div
            v-if="showPin"
            @click.stop="clickPin(key)"
            class="pin"
            :data-tips="isPinned ? '取消置顶' : '置顶'"
        >
            <svg-icon
                icon="pushpin"
                size="20"
                :color="isPinned ? '#FFC107' : '#818181'"
                :filled="isPinned"
            />
        </div>
        <div class="card-body">
            <div v-if="hasNews" class="news-dot"></div>
            <div class="q-title">{{ title }}</div>
            <div class="q-body">
                <div v-if="!isMarkdown" class="text">{{ text }}</div>
                <div
                    v-else
                    :class="'md-container' + (showAllMarkdown ? '-all' : '')"
                >
                    <MdPreview
                        id="preview-only"
                        :model-value="text"
                        class="md-preview"
                    />
                </div>
                <div v-if="imageContainer.hasImages" class="photos-container">
                    <div
                        class="preview-group"
                        :style="{
                            width: imageContainer.containerWidth,
                            gap: imageContainer.gap + ' ' + imageContainer.gap,
                        }"
                    >
                        <el-image
                            @click.stop
                            v-for="(img, index) in imageUrls"
                            :key="img"
                            :src="img"
                            :style="{
                                width: imageContainer.size,
                                height: imageContainer.size,
                                borderRadius: '6px',
                            }"
                            :preview-src-list="imageUrls"
                            :initial-index="index"
                            fit="cover"
                            lazy
                            infinite
                            preview-teleported
                            style="cursor: zoom-in"
                        ></el-image>
                    </div>
                </div>
            </div>
            <div class="q-footer">
                <div class="looks">
                    <svg-icon icon="eye" size="16" color="#818181" />
                    <span class="counts">{{ views }}</span>
                </div>
                <div class="time">{{ timeStr }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleCard.scss"></style>
