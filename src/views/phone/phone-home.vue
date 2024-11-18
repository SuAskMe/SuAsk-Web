<template>
    <a-layout style="height: 100dvh;">
        <a-layout-header class="header">
            <div v-if="isQuestionPage" class="header-item" style="float: left; margin-right: auto;">
                <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
                <div style="display: flex; flex-direction: column;">
                    <span class="question-title-text" style="color: #71B6FF; font-size: 14px;"> {{ questionTitle }}
                    </span>
                    <span class="question-title-text" style="padding-top: 5px; font-size: 12px;"> {{ questionContent }}
                    </span>
                </div>
            </div>
            <div class="header-item" @click="changeSort">
                <span style="line-height: 60px; font-size: 14px;"> {{ sortText[sortIndex] }} </span>
                <svg-icon icon="sort-down" :color="sortIndex == 0 ? '#808080' : '#71B6FF'" size="20px" />
            </div>
            <div class="header-item">
                <svg-icon icon="search" :color="searchIndex == 0 ? '#808080' : '#71B6FF'" size="20px"
                    @click="changeSearch" />
            </div>
        </a-layout-header>
        <a-layout-content>Content</a-layout-content>
        <a-layout-footer>
            <div v-if="false" class="footer">
                <control-panel-item icon="group" size="30px" :clicked="selectedItem == 'group'"
                    @updateSelected="updateSelected" />
                <control-panel-item icon="graduation-cap" size="30px" :clicked="selectedItem == 'graduation-cap'"
                    @updateSelected="updateSelected" />
                <control-panel-item icon="chat-1" size="30px" :clicked="selectedItem == 'chat-1'"
                    @updateSelected="updateSelected" />
                <control-panel-item icon="settings-2" size="30px" :clicked="selectedItem == 'settings-2'"
                    @updateSelected="updateSelected" />
            </div>
            <div v-if="false" class="footer">
                <control-panel-item icon="camera-lens" size="30px" :clicked="selectedItem == 'camera-lens'"
                    @updateSelected="updateSelected" />
                <control-panel-item icon="message" size="30px" :clicked="selectedItem == 'message'"
                    @updateSelected="updateSelected" />
                <control-panel-item icon="settings-2" size="30px" :clicked="selectedItem == 'settings-2'"
                    @updateSelected="updateSelected" />
            </div>
            <div v-if="true" class="footer" style="gap: 4vw; padding: 0 5vw 0 5vw !important;">
                <div style=" width: 100%">
                    <a-input style="width: 100%; border-radius: 50px;" placeholder="请输入..." allow-clear />
                </div>
                <svg-icon icon="image" color="#71B6FF" size="30px" />
                <svg-icon icon="link" color="#71B6FF" size="30px" />
            </div>
        </a-layout-footer>
    </a-layout>
</template>

<script setup lang='ts'>
import ControlPanelItem from '@/components/control-panel-item.vue';
import { ref } from 'vue';

const selectedItem = ref<string>('');
const updateSelected = (id: string) => {
    selectedItem.value = id;
};

const sortText = ref(['按时间排序', '按热度排序']);
const sortIndex = ref(0);

const searchIndex = ref(0);

function changeSort() {
    sortIndex.value = sortIndex.value === 0 ? 1 : 0;
}

function changeSearch() {
    searchIndex.value = searchIndex.value === 0 ? 1 : 0;
}

const isQuestionPage = ref(true);

const questionTitle = ref('如何提高角色的输出？');
const questionContent = ref('我有一个角色，但是输出不够高aaaaaaaaaaaaaaaa');
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    border-bottom: #E5E5E5 solid 1px;
    height: 6dvh;
    justify-content: flex-end;
    padding: 0 5vw 0 3vw;
    gap: 10px;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: #E5E5E5 solid 1px;
    height: 6dvh;
    padding: 0 10vw 0 10vw;
}

.header-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.question-title-text {
    max-width: 40vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>