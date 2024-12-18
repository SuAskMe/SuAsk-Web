<template>
    <div class="control-panel-item">
        <control-panel-item id="stu-ask-all" icon="group" text="问大家" :clicked="selectedItem == 'stu-ask-all'"
            @updateSelected="updateSelected" jump-to-path="/home/ask-all" />
        <control-panel-item id="stu-ask-teacher" icon="graduation-cap" text="问老师"
            :clicked="selectedItem == 'stu-ask-teacher'" @updateSelected="updateSelected"
            jump-to-path="/home/ask-teacher" />
        <control-panel-item id="stu-ask-history" icon="chat-history" text="历史提问"
            :clicked="selectedItem == 'stu-ask-history'" @updateSelected="updateSelected"
            jump-to-path="/home/ask-history" />
        <control-panel-item id="stu-star" icon="star" text="我的收藏" :clicked="selectedItem == 'stu-star'"
            @updateSelected="updateSelected" jump-to-path="/home/my-favorite" />
        <control-panel-item id="stu-settings" icon="settings" text="设置" :clicked="selectedItem == 'stu-settings'"
            @updateSelected="updateSelected" jump-to-path="/home/setting" />
        <control-panel-item id="stu-help" icon="question" text="帮助" :clicked="selectedItem == 'stu-help'"
            @updateSelected="updateSelected" jump-to-path="/home/help" />
    </div>
</template>

<script setup lang='ts'>
import { updateSelected, selectedItem } from './selectedItem';
import ControlPanelItem from '@/components/control-panel-item';

</script>

<style scoped lang="scss">
.control-panel-item {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    gap: 20px;
}
</style>