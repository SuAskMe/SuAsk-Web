<template>
    <div class="control-panel-item">
        <control-panel-item id="tea-see-all" icon="camera-lens" text="看看大家" :clicked="selectedItem == 'tea-see-all'"
            @updateSelected="updateSelected" jumpToPath="ask-all" />
        <div>
            <div @click="toggleOpen" style="display: flex; align-items: center;">
                <control-panel-item id="tea-question" icon="message" text="我的提问箱"
                    :clicked="selectedItem == 'tea-question'" @updateSelected="updateSelected"
                    jumpToPath="my-question" />
                <svg-icon v-if="!isOpen" icon="arrow-left" color="#808080" size="24px" style="padding-top: 2px;" />
                <svg-icon v-if="isOpen" icon="arrow-down" color="#808080" size="24px" style="padding-top: 2px;" />
            </div>
            <ul v-show="isOpen" class="menu-items">
                <control-panel-item class="menu-item" id="tea-question-new" text="新的提问"
                    :clicked="selectedItem == 'tea-question-new'" @updateSelected="updateSelected"
                    jumpToPath="new-question" />
                <control-panel-item class="menu-item" id="tea-question-old" text="已回答"
                    :clicked="selectedItem == 'tea-question-old'" @updateSelected="updateSelected"
                    jumpToPath="old-question" />
                <control-panel-item class="menu-item" id="tea-question-top" text="置顶"
                    :clicked="selectedItem == 'tea-question-top'" @updateSelected="updateSelected"
                    jumpToPath="top-question" />
            </ul>
        </div>
        <control-panel-item id="tea-settings" icon="settings" text="设置" :clicked="selectedItem == 'tea-settings'"
            @updateSelected="updateSelected" jumpToPath="setting" />
        <control-panel-item id="tea-help" icon="question" text="帮助" :clicked="selectedItem == 'tea-help'"
            @updateSelected="updateSelected" jumpToPath="help" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { updateSelected, selectedItem } from './selectedItem';
import ControlPanelItem from '@/components/control-panel-item';

// 教师 [我的提问箱] 是否展开
const isOpen = ref(false);
function toggleOpen() {
    isOpen.value = !isOpen.value;
}
</script>

<style scoped lang="scss">
.control-panel-item {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    gap: 20px;
}
</style>