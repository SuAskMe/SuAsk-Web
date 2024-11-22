<script setup lang="ts">
import { computed } from "vue";
import { getImgStyle, getTimeStr } from "../bubble-card";
interface BubbleCardProps {
    title: string;
    text: string;
    views: number;
    timeStamp: number;
    hasNews?: boolean;
    showPin?: boolean;
    isPinned?: boolean;
    bubbleKey?: any;
    imageUrls?: string[];
    clickCard?: (key: any) => void;
    clickPin?: (key: any) => void;
}
const props = defineProps<BubbleCardProps>();
const imageContainer = computed(() => getImgStyle(props.imageUrls));
const timeStr = computed(() => getTimeStr(props.timeStamp));
const key = computed(() => {
    return props.bubbleKey ? props.bubbleKey : null;
});
const hasClickCard = computed(() => (props.clickCard ? true : false));
</script>

<template>
    <div
        class="card-container"
        @click.stop="clickCard(key)"
        :style="hasClickCard ? { cursor: 'pointer' } : {}"
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
