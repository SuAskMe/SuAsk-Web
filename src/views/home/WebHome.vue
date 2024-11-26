<script lang="ts" setup>
import { ref } from 'vue';
import SvgIcon from '@/components/svg-icon';
import BackgroundImg from '@/components/backgroud-img';
import AskDialog from '@/components/ask-dialog';
import ControlPanelItem from '@/components/control-panel-item';
import { router } from '@/router';

// 用户信息
const userAvatar = ref("https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp");
const userId = ref("GenshinStart");
const userName = ref("原神启动");

// 选择高亮组件
const selectedItem = ref<string>('');
const updateSelected = (id: string) => {
    selectedItem.value = id;
};

// 教师 [我的提问箱] 是否展开
const isOpen = ref(false);
function toggleOpen() {
    isOpen.value = !isOpen.value;
}

function jumpToSetting() {
    router.push('/home/setting');
}

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
                <div v-if="true" class="control-panel">
                    <control-panel-item id="stu-ask-all" icon="group" text="问大家"
                        :clicked="selectedItem == 'stu-ask-all'" @updateSelected="updateSelected" />
                    <control-panel-item id="stu-ask-teacher" icon="graduation-cap" text="问老师"
                        :clicked="selectedItem == 'stu-ask-teacher'" @updateSelected="updateSelected" />
                    <control-panel-item id="stu-ask-history" icon="chat-history" text="历史提问"
                        :clicked="selectedItem == 'stu-ask-history'" @updateSelected="updateSelected" />
                    <control-panel-item id="stu-star" icon="star" text="我的收藏" :clicked="selectedItem == 'stu-star'"
                        @updateSelected="updateSelected" />
                    <control-panel-item id="stu-settings" icon="settings" text="设置"
                        :clicked="selectedItem == 'stu-settings'" @updateSelected="updateSelected"
                        jump-to-path="setting" />
                    <control-panel-item id="stu-help" icon="question" text="帮助" :clicked="selectedItem == 'stu-help'"
                        @updateSelected="updateSelected" />
                </div>
                <div v-if="false" class="control-panel">
                    <control-panel-item id="tea-see-all" icon="camera-lens" text="看看大家"
                        :clicked="selectedItem == 'tea-see-all'" @updateSelected="updateSelected" />
                    <div>
                        <div @click="toggleOpen" style="display: flex; align-items: center;">
                            <control-panel-item id="tea-question" icon="message" text="我的提问箱"
                                :clicked="selectedItem == 'tea-question'" @updateSelected="updateSelected" />
                            <svg-icon v-if="!isOpen" icon="arrow-left" color="#808080" size="24px"
                                style="padding-top: 2px;" />
                            <svg-icon v-if="isOpen" icon="arrow-down" color="#808080" size="24px"
                                style="padding-top: 2px;" />
                        </div>
                        <ul v-show="isOpen" class="menu-items">
                            <control-panel-item class="menu-item" id="tea-question-new" text="新的提问"
                                :clicked="selectedItem == 'tea-question-new'" @updateSelected="updateSelected" />
                            <control-panel-item class="menu-item" id="tea-question-old" text="已回答"
                                :clicked="selectedItem == 'tea-question-old'" @updateSelected="updateSelected" />
                            <control-panel-item class="menu-item" id="tea-question-top" text="置顶"
                                :clicked="selectedItem == 'tea-question-top'" @updateSelected="updateSelected" />
                        </ul>
                    </div>
                    <control-panel-item id="tea-settings" icon="settings" text="设置"
                        :clicked="selectedItem == 'tea-settings'" @updateSelected="updateSelected" />
                    <control-panel-item id="tea-help" icon="question" text="帮助" :clicked="selectedItem == 'tea-help'"
                        @updateSelected="updateSelected" />
                </div>
            </div>
        </a-layout-sider>
        <a-layout style="width: 100%;">
            <router-view />
        </a-layout>

    </a-layout>
    <!-- <ask-dialog :visible="true" :fullscreen="false" teacher-name="苏钰鑫" /> -->
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
    height: 6vh;
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
    height: 6vh;
    gap: 20px;
    padding-right: 20px;
}

.content {
    width: 100%;
    height: 100%;
}

.menu-items {
    list-style: none;
    margin: 0;
    padding-left: 0;
}

.menu-items .menu-item {
    padding-left: 24px;
}
</style>