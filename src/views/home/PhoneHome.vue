<template>
    <a-layout style="height: 100dvh;">
        <a-layout-header>
            <div v-if="true" class="header">
                <div v-if="isQuestionPage" class="header-item" style="float: left; margin-right: auto;">
                    <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
                    <div style="display: flex; flex-direction: column;">
                        <span class="question-title-text" style="color: #71B6FF; font-size: 14px;"> {{ questionTitle }}
                        </span>
                        <span class="question-title-text" style="padding-top: 5px; font-size: 12px;"> {{ questionContent
                            }}
                        </span>
                    </div>
                </div>
                <div class="header-item">
                    <div @click="changeSort" style="display: flex; align-items: center;">
                        <span style="line-height: 60px; font-size: 14px;"> {{ sortText[sortIndex] }} </span>
                        <svg-icon icon="sort-down" :color="sortIndex == 0 ? '#808080' : '#71B6FF'" size="20px" />
                    </div>
                    <div>
                        <svg-icon icon="search" :color="searchIndex == 0 ? '#808080' : '#71B6FF'" size="20px"
                            @click="changeSearch" />
                    </div>
                </div>

            </div>

        </a-layout-header>
        <a-layout-content>
            <div class="content">
                <!-- <background-img img_index="1" style="position:absolute;left:0;top:0; z-index: -1;" /> -->
                <router-view />
            </div>
        </a-layout-content>
        <a-layout-footer>
            <div class="footer">
                <div v-if="true" class="footer-item">
                    <control-panel-item id="stu-ask-all" icon="group" size="30px"
                        :clicked="selectedItem == 'stu-ask-all'" @updateSelected="updateSelected" />
                    <control-panel-item id="stu-ask-teacher" icon="graduation-cap" size="30px"
                        :clicked="selectedItem == 'stu-ask-teacher'" @updateSelected="updateSelected" />
                    <control-panel-item id="stu-message" icon="chat-1" size="30px"
                        :clicked="selectedItem == 'stu-message'" @updateSelected="updateSelected" />
                    <control-panel-item id="stu-settings" icon="settings-2" size="30px"
                        :clicked="selectedItem == 'stu-settings'" @updateSelected="updateSelected" />
                </div>
                <div v-if="false" class="footer-item">
                    <control-panel-item id="tea-see-all" icon="camera-lens" size="30px"
                        :clicked="selectedItem == 'tea-see-all'" @updateSelected="updateSelected" />
                    <control-panel-item id="tea-question" icon="message" size="30px"
                        :clicked="selectedItem == 'tea-question'" @updateSelected="updateSelected" />
                    <control-panel-item id="tea-settings" icon="settings-2" size="30px"
                        :clicked="selectedItem == 'tea-settings'" @updateSelected="updateSelected" />
                </div>
                <div v-if="false" class="footer-item" style="gap: 4vw; padding: 0 5vw 0 5vw !important;">
                    <div style=" width: 100%">
                        <a-input style="width: 100%; border-radius: 50px;" placeholder="请输入..." allow-clear />
                    </div>
                    <svg-icon icon="image" color="#71B6FF" size="30px" />
                    <svg-icon icon="link" color="#71B6FF" size="30px" />
                </div>
            </div>
        </a-layout-footer>
    </a-layout>
</template>

<script setup lang='ts'>
import BackgroundImg from '@/components/backgroud-img';
import ControlPanelItem from '@/components/control-panel-item';
import { ref } from 'vue';

// 选择高亮组件
const selectedItem = ref<string>('');
const updateSelected = (id: string) => {
    selectedItem.value = id;
};

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

// 是否为问题页面
const isQuestionPage = ref(true);
const questionTitle = ref('如何提高角色的输出？'); // 问题标题
const questionContent = ref('我有一个角色，但是输出不够高aaaaaaaaaaaaaaaa'); // 问题内容
</script>

<style scoped>
.header {
    width: 100%;
    background-color: white;
    position: fixed;
    top: 0;
    z-index: 1000;
    border-bottom: #E5E5E5 solid 1px;

    .header-item {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 6dvh;
        justify-content: flex-end;
        padding: 0 5vw 0 3vw;
    }
}

.footer {
    width: 100%;
    background-color: white;
    position: fixed;
    bottom: 0;
    border-top: #E5E5E5 solid 1px;

    .footer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        height: 6dvh;
        padding: 0 10vw 0 10vw;
    }
}



.question-title-text {
    max-width: 40vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.content {
    padding: 6vh 0;
}
</style>