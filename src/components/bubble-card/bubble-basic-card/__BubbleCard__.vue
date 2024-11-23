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
    width?: number;
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
    return { width: props.width ? props.width + "px" : "500px" };
});
const imageContainer = computed(() =>
    getImgStyle(props.imageUrls, props.width ? props.width * 0.9 : 450)
);
</script>

<template>
    <div
        class="card-container"
        @click.stop="clickCard(key)"
        :style="containerStyle"
    >
        <div class="card-body">
            <div v-if="hasNews" class="news-dot"></div>
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
                        :style="{ width: imageContainer.containerWidth + 'px' }"
                    >
                        <a-image-preview-group infinite>
                            <a-image
                                @click.stop
                                v-for="(img, index) in imageUrls"
                                :key="index"
                                :src="img"
                                fit="cover"
                                show-loader
                                style="cursor: zoom-in"
                                :width="imageContainer.size"
                                :height="imageContainer.size"
                            ></a-image>
                        </a-image-preview-group>
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

<style scoped src="./BubbleCard.css"></style>
