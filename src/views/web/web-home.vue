<script lang="ts" setup>
import { ref } from 'vue';
import ControlPanelItem from '../../components/control-panel-item.vue';
import SvgIcon from '@/components/svg-icon.vue';

const userAvatar = ref("https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp");
const userId = ref("GenshinStart");
const userName = ref("原神启动");

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

const searchText = ref('');

const isQuestionPage = ref(true);

const questionTitle = ref('如何提高角色的输出？');
const questionContent = ref('我有一个角色，但是输出不够高，有什么办法可以提高输出？');

</script>

<template>
    <a-layout style="height: 100vh;">
        <a-layout-sider style="width: 300px">
            <div style="height: 80px;">
                <div style="padding-top: 20px;">
                    <svg-icon icon="qr-code" color="#808080" size="24px" style="float: left; padding-left: 20px;" />
                    <svg-icon icon="communicate_message_emoji" color="#808080" size="24px"
                        style="float: right; padding-right: 20px;" />
                </div>
            </div>
            <div style="margin-left: 40px;">
                <a-avatar :size="120" :image-url="userAvatar" />
                <div class="user-name">
                    <span>{{ userName }}</span>
                </div>
                <div class="user-id">
                    <span>@{{ userId }}</span>
                </div>
                <div class="control-panel">
                    <control-panel-item icon="group" text="问大家" :clicked="selectedItem == 'group'"
                        @updateSelected="updateSelected" />
                    <control-panel-item icon="graduation-cap" text="问老师" :clicked="selectedItem == 'graduation-cap'"
                        @updateSelected="updateSelected" />
                    <control-panel-item icon="chat-history" text="历史提问" :clicked="selectedItem == 'chat-history'"
                        @updateSelected="updateSelected" />
                    <control-panel-item icon="star" text="我的收藏" :clicked="selectedItem == 'star'"
                        @updateSelected="updateSelected" />
                    <control-panel-item icon="settings" text="设置" :clicked="selectedItem == 'settings'"
                        @updateSelected="updateSelected" />
                    <control-panel-item icon="question" text="帮助" :clicked="selectedItem == 'question'"
                        @updateSelected="updateSelected" />
                </div>
            </div>
        </a-layout-sider>
        <a-layout>
            <a-layout-header class="header">
                <div v-if="isQuestionPage" class="header-item"
                    style="float: left; margin-right: auto; margin-left: 20px;">
                    <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
                    <div style="display: flex; flex-direction: column;">
                        <span style="color: #71B6FF; font-size: 20px;"> {{ questionTitle }} </span>
                        <span style="padding-top: 5px;"> {{ questionContent }} </span>
                    </div>
                </div>
                <div class="header-item" @click="changeSort">
                    <span style="line-height: 60px; font-size: 18px;"> {{ sortText[sortIndex] }} </span>
                    <svg-icon icon="sort-down" :color="sortIndex == 0 ? '#808080' : '#71B6FF'" size="24px" />
                </div>
                <div class="header-item">
                    <svg-icon v-if="searchIndex == 0" icon="search" :color="searchIndex == 0 ? '#808080' : '#71B6FF'"
                        size="24px" @click="changeSearch" />
                    <div v-else>
                        <a-input-search v-model="searchText" :style="{ width: '320px' }" placeholder="请输入搜索内容" />
                    </div>
                </div>
            </a-layout-header>
            <a-layout-content>Content</a-layout-content>
            <a-layout-footer class="footer">
                <div style="margin-left: 20px; width: 100%; margin-right: 20px;">
                    <a-input style="width: 100%; border-radius: 50px;" placeholder="请输入..." allow-clear />
                </div>
                <svg-icon icon="image" color="#71B6FF" size="30px" />
                <svg-icon icon="link" color="#71B6FF" size="30px" />
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<style scoped>
.user-name {
    text-align: left;
    font-size: 25px;
    font-weight: bold;
    margin-top: 10px;
}

.user-id {
    text-align: left;
    font-size: 13px;
    color: #808080;
    margin-top: 10px;

}

.control-panel {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    gap: 20px;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-right: 20px;
    border-bottom: #E5E5E5 solid 1px;
    height: 60px;
}

.header-item {
    display: flex;
    align-items: center;
    gap: 20px;
}

.footer {
    display: flex;
    align-items: center;
    border-top: #E5E5E5 solid 1px;
    height: 60px;
    gap: 20px;
    margin-right: 20px;
}
</style>