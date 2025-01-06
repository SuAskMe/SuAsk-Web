<template>
    <div class="control-panel-item">
        <control-panel-item id="tea-see-all" icon="camera-lens" text="看看大家" jumpToPath="ask-all" />
        <div>
            <div @click="toggleOpen" style="display: flex; align-items: center;">
                <control-panel-item id="tea-question" icon="message" text="我的提问箱" jumpToPath="my-question" />
                <svg-icon v-if="!isOpen" icon="arrow-left" color="#808080" size="24px" style="padding-top: 2px;" />
                <svg-icon v-if="isOpen" icon="arrow-down" color="#808080" size="24px" style="padding-top: 2px;" />
            </div>
            <ul v-show="isOpen" class="menu-items">
                <control-panel-item class="menu-item" id="tea-question-new" text="新的提问" jumpToPath="new-question" />
                <control-panel-item class="menu-item" id="tea-question-old" text="已回答" jumpToPath="old-question" />
                <control-panel-item class="menu-item" id="tea-question-top" text="置顶" jumpToPath="top-question" />
            </ul>
        </div>
        <control-panel-item id="tea-settings" icon="settings" text="设置" jumpToPath="setting" />
        <control-panel-item id="tea-help" icon="question" text="帮助" jumpToPath="help" />
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
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