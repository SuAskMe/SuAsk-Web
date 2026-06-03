<template>
    <section
        class="question-list-page"
        :class="{
            'question-list-page--borderless': !borderTop,
            'question-list-page--masked': scrollMask,
        }"
    >
        <header class="question-list-page__header">
            <slot name="header" />
        </header>
        <main class="question-list-page__main">
            <BackgroundImg :img_index="imgIndex" class="question-list-page__background" />
            <slot name="toolbar" />
            <el-scrollbar ref="scrollBar" v-loading="loading" @scroll="handleScroll">
                <div
                    class="question-list-page__content"
                    :class="{
                        'question-list-page__content--mobile':
                            centerOnMobile && deviceType.isMobile,
                    }"
                >
                    <slot />
                </div>
            </el-scrollbar>
            <slot name="floating" />
        </main>
    </section>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus/es/components/scrollbar/index.mjs'
import { nextTick, ref } from 'vue'
import BackgroundImg from '@/components/background-img'
import { DeviceTypeStore } from '@/store/modules/device-type'

const props = withDefaults(
    defineProps<{
        imgIndex: number
        loading?: boolean
        borderTop?: boolean
        scrollMask?: boolean
        centerOnMobile?: boolean
        bottomThreshold?: number
    }>(),
    {
        loading: false,
        borderTop: true,
        scrollMask: false,
        centerOnMobile: true,
        bottomThreshold: 0,
    },
)

const emit = defineEmits<{
    reachBottom: []
}>()

const deviceType = DeviceTypeStore()
const scrollBar = ref<InstanceType<typeof ElScrollbar>>()

const handleScroll = () => {
    const wrap = scrollBar.value?.wrapRef
    if (!wrap || props.loading) {
        return
    }
    const reachedBottom =
        Math.ceil(wrap.scrollTop + wrap.clientHeight + props.bottomThreshold) >= wrap.scrollHeight
    if (reachedBottom) {
        emit('reachBottom')
    }
}

const scrollToTop = () => {
    nextTick(() => {
        if (scrollBar.value?.wrapRef) {
            scrollBar.value.wrapRef.scrollTop = 0
        }
    })
}

defineExpose({
    scrollToTop,
})
</script>

<style scoped lang="scss">
.question-list-page {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

.question-list-page__header {
    height: auto;
    flex: 0 0 auto;
}

.question-list-page__main {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    flex-direction: column;
    padding: 0;
    border-top: solid 1px $su-border;
}

.question-list-page--borderless {
    .question-list-page__main {
        border-top: none;
    }
}

.question-list-page__background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.question-list-page__content {
    min-height: 100%;
}

.question-list-page__content--mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
}

:deep(.el-scrollbar) {
    flex: 1 1 0;
    min-height: 0;
    height: auto;
}

:deep(.el-scrollbar__bar.is-horizontal) {
    display: none !important;
}

:deep(.el-scrollbar__wrap) {
    outline: none;
}

:deep(.el-loading-mask) {
    background-color: transparent;
}

.question-list-page--masked {
    :deep(.el-scrollbar__wrap) {
        mask-image: linear-gradient(to bottom, transparent, black 24px);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 24px);
    }
}
</style>
