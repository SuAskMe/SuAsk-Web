<template>
    <div class="header">
        <div class="back-button">
            <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
        </div>
        <div v-if="props.isQuestionPage" class="question-title">
            <p :class="isDesktop ? 'title-web' : 'title-phone'"> {{ questionTitle }} </p>
            <p :class="isDesktop ? 'sub-title-web' : 'sub-title-phone'"> {{ questionContent }} </p>
        </div>
        <div class="sort-and-search">
            <div class="header-item" @click="changeSort">
                <span> {{ sortText[sortIndex] }} </span>
                <svg-icon icon="sort-down" :color="sortIndex == 0 ? '#808080' : '#71B6FF'" size="22px" />
            </div>
            <div class="header-item">
                <svg-icon v-if="searchIndex == 0" icon="search" :color="searchIndex == 0 ? '#808080' : '#71B6FF'"
                    size="22px" @click="changeSearch" />
                <div v-else>
                    <!-- <a-input-search v-model="searchText" :style="{ width: '320px' }" placeholder="请输入搜索内容" /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, inject, ref } from 'vue';

// const isDesktop = computed(() => inject('deviceType', 'desktop') == 'desktop')
const props = defineProps({
    userType: String,
    deviceType: String,
    isQuestionPage: {
        type: Boolean,
        // required: true
    }
})

const isDesktop = computed(() => {
    if (props.deviceType){
        return props.deviceType
    } else {
        return 'desktop'
    }
})

// 排序组件
const sortText = ref(['按时间排序', '按热度排序']);
const sortIndex = ref(0);
function changeSort() {
    sortIndex.value = sortIndex.value === 0 ? 1 : 0;
}

// 搜索组件
const searchIndex = ref(0);
function changeSearch() {
    searchIndex.value = searchIndex.value === 0 ? 1 : 0;
}
const searchText = ref(''); // 搜索内容

const questionTitle = ref('如何提高角色的输出？'); // 问题标题
const questionContent = ref('我有一个角色，但是输出不够高，有什么办法可以提高输出？'); // 问题内容
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    margin-left: auto;
    gap: 10px;

    .back-button {
        height: 30px;
    }

    .question-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        white-space: nowrap;


        p {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .title-web {
            color: $su-blue;
            font-size: 20px;
        }

        .title-phone {
            color: $su-blue;
            font-size: 16px;
        }

        .sub-title-web {
            padding-top: 5px;
            font-size: 16px
        }

        .sub-title-phone {
            padding-top: 5px;
            font-size: 12px
        }
    }

    .sort-and-search {
        display: flex;
        align-items: center;
        margin-left: auto;
        gap: 10px;
    }

    .header-item {
        display: flex;
        align-items: center;
        gap: 10px;

        span {
            line-height: 60px;
            font-size: 16px;
            white-space: nowrap;
        }
    }
}
</style>
