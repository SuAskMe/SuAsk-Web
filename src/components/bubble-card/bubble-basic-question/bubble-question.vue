<script setup lang="ts">
import { computed } from "vue";
import { getImgStyle, getTimeStr } from "../bubble-card";
interface BubbleQuestionProps {
    isSimple: boolean;
    title: string;
    text: string;
    views: number;
    timeStamp: number;
    bubbleKey?: any;
    answerNum?: number;
    imagesUrls?: string[];
    avatars?: string[];
    isFavourite?: boolean;
    clickCard?: (key: any) => void;
    clickFavourite?: (key: any) => void;
}
const props = defineProps<BubbleQuestionProps>();
const imageContainer = computed(() => getImgStyle(props.imagesUrls));
const timeStr = computed(() => getTimeStr(props.timeStamp));
const key = computed(() => {
    return props.bubbleKey ? props.bubbleKey : null;
});
</script>

<template>
    <div class="card-container" @click.stop="clickCard(key)">
        <div
            :style="
                isSimple
                    ? { padding: '14px 18px 14px 18px' }
                    : { padding: '14px 18px 0px 18px' }
            "
        >
            <div class="q-title">{{ title }}</div>
            <div class="q-body">
                <div class="text">{{ text }}</div>
                <div v-if="imageContainer.hasImages" class="photos-container">
                    <a-image-preview-group infinite>
                        <a-image
                            @click.stop
                            v-for="(img, index) in imagesUrls"
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
            <div class="q-footer">
                <div class="looks">
                    <svg-icon icon="eye" size="16" color="#818181" />
                    <span class="counts">{{ views }}</span>
                </div>
                <div class="time">{{ timeStr }}</div>
            </div>
        </div>
        <div v-if="!isSimple">
            <div v-if="answerNum" class="card-footer">
                <img
                    :src="avatar"
                    onerror="this.src='/default-avatar.png'; this.onerror=null;"
                    v-for="(avatar, index) in avatars"
                    :key="index"
                    :style="{
                        marginLeft: index === 0 ? '16px' : '-12px',
                        zIndex: 1 - index,
                    }"
                    class="avatar"
                />
                <div
                    v-if="answerNum > 2"
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
                        color="#66b0ff"
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
                        color="#66b0ff"
                        :filled="isFavourite ? true : false"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped src="./bubble-question.css"></style>
