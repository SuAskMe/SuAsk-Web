<script setup lang="ts">
import { computed, ref } from "vue";
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
    isFavorite?: boolean;
    showFavorite?: boolean;
    clickCard?: (key: any) => void;
    clickFavorite?: (key: any) => void;
}
const props = withDefaults(defineProps<BubbleQuestionProps>(), {
    showFavorite: true,
    clickCard: () => {},
    clickFavorite: () => {},
});
const timeStr = computed(() => getTimeStr(props.timeStamp));
const key = computed(() => {
    return props.bubbleKey !== undefined ? props.bubbleKey : null;
});
const containerStyle = computed(() => {
    return { width: props.width ? props.width : "450px" };
});
const imageContainer = computed(() =>
    getImgStyle(props.imageUrls, props.width)
);

const showDefaultAvatar = (index: number) => {
    if (props.avatars && props.avatars[index]) {
        props.avatars[index] = "/src/assets/default-avatar.png";
    }
};
</script>

<template>
    <div class="bubble-question">
        <div class="card-container" @click.stop="clickCard(key)">
            <div class="card-body" :style="containerStyle">
                <div class="q-title">{{ title }}</div>
                <div class="q-body">
                    <div v-if="!isMarkdown" class="text">{{ text }}</div>
                    <div
                        v-else
                        :class="
                            'md-container' + (showAllMarkdown ? '-all' : '')
                        "
                    >
                        <MdPreview
                            id="preview-only"
                            :model-value="text"
                            class="md-preview"
                        />
                    </div>
                    <div
                        v-if="imageContainer.hasImages"
                        class="photos-container"
                    >
                        <div
                            class="preview-group"
                            :style="{
                                width: imageContainer.containerWidth,
                                gap:
                                    imageContainer.gap +
                                    ' ' +
                                    imageContainer.gap,
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
                <el-avatar
                    v-for="(avatar, index) in avatars"
                    :key="index"
                    :src="avatar"
                    :size="32"
                    :style="{
                        marginLeft: index === 0 ? '16px' : '-14px',
                        zIndex: 10 - index,
                    }"
                    class="avatar"
                    @error="showDefaultAvatar(index)"
                >
                    <img src="/src/assets/default-avatar.png" />
                </el-avatar>
                <div class="text">{{ answerNum }} 个回答</div>
                <div
                    v-if="showFavorite"
                    class="favorite"
                    :data-tips="isFavorite ? '取消收藏' : '收藏'"
                    @click.stop="clickFavorite(key)"
                >
                    <svg-icon
                        icon="bookmark"
                        size="24"
                        :color="isFavorite ? '#FFC107' : '#66b0ff'"
                        :filled="isFavorite"
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
                    v-if="showFavorite"
                    class="favorite"
                    :data-tips="isFavorite ? '取消收藏' : '收藏'"
                    @click.stop="clickFavorite(key)"
                >
                    <svg-icon
                        icon="bookmark"
                        size="24"
                        :color="isFavorite ? '#FFC107' : '#66b0ff'"
                        :filled="isFavorite"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped src="./BubbleQuestion.scss"></style>
