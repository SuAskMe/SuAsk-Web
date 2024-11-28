<script setup lang="ts">
import { computed } from "vue";
import { getImgStyle, getTimeStr } from "../bubble-card";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
interface BubbleQuestionProps {
    title: string;
    text: string;
    views: number;
    timeStamp: number;
    width?: string;
    isMarkdown?: boolean;
    showAllMarkdown?: boolean;
    bubbleKey?: any;
    answerNum?: number;
    imageUrls?: string[];
    avatars?: string[];
    isFavourite?: boolean;
    clickCard?: (key: any) => void;
    clickFavourite?: (key: any) => void;
}
const props = defineProps<BubbleQuestionProps>();
const timeStr = computed(() => getTimeStr(props.timeStamp));
const key = computed(() => {
    return props.bubbleKey ? props.bubbleKey : null;
});
const containerStyle = computed(() => {
    return { width: props.width ? props.width : "450px" };
});
const imageContainer = computed(() =>
    getImgStyle(props.imageUrls, props.width)
);
</script>

<template>
    <div class="card-container" @click.stop="clickCard(key)">
        <div class="card-body" :style="containerStyle">
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
        <div v-if="answerNum && answerNum > 0" class="card-footer">
            <img
                :src="avatar"
                onerror="this.src='src/assets/default-avatar.png'; this.onerror=null;"
                v-for="(avatar, index) in avatars"
                :key="index"
                :style="{
                    marginLeft: index === 0 ? '16px' : '-12px',
                    zIndex: 1 - index,
                }"
                class="avatar"
            />
            <div
                v-if="avatars && answerNum > avatars.length"
                style="font-size: 32px; color: #66b0ff"
            >
                ...
            </div>
            <div class="text">{{ answerNum }} 个回答</div>
            <div
                class="favourite"
                :data-tips="isFavourite ? '取消收藏' : '收藏'"
                @click.stop="clickFavourite(key)"
            >
                <svg-icon
                    icon="bookmark"
                    size="24"
                    :color="isFavourite ? '#FFC107' : '#66b0ff'"
                    :filled="isFavourite"
                />
            </div>
        </div>
        <div v-else class="card-footer">
            <svg-icon
                class="msg-icon"
                icon="communicate_message"
                size="24"
                color="#66b0ff"
            />
            <div class="text">发表一个回答...</div>
            <div
                class="favourite"
                :data-tips="isFavourite ? '取消收藏' : '收藏'"
                @click.stop="clickFavourite(key)"
            >
                <svg-icon
                    icon="bookmark"
                    size="24"
                    :color="isFavourite ? '#FFC107' : '#66b0ff'"
                    :filled="isFavourite"
                />
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleQuestion.scss"></style>
