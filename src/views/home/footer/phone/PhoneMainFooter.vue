<template>
    <div v-if="deviceType == 'phone'">
        <div v-if="userType == 'student'" class="footer-item">
            <control-panel-item id="stu-ask-all" icon="group" size="30px" :clicked="selectedItem == 'stu-ask-all'"
                @updateSelected="updateSelected" jumpToPath="ask-all" />
            <control-panel-item id="stu-ask-teacher" icon="graduation-cap" size="30px"
                :clicked="selectedItem == 'stu-ask-teacher'" @updateSelected="updateSelected"
                jumpToPath="ask-teacher" />
            <control-panel-item id="stu-message" icon="chat-1" size="30px" :clicked="selectedItem == 'stu-message'"
                @updateSelected="updateSelected" jumpToPath="message" />
            <control-panel-item id="stu-settings" icon="settings-2" size="30px"
                :clicked="selectedItem == 'stu-settings'" @updateSelected="updateSelected" jumpToPath="setting" />
        </div>
        <div v-if="userType == 'teacher'" class="footer-item">
            <control-panel-item id="tea-see-all" icon="camera-lens" size="30px" :clicked="selectedItem == 'tea-see-all'"
                @updateSelected="updateSelected" jumpToPath="ask-all" />
            <control-panel-item id="tea-question" icon="message" size="30px" :clicked="selectedItem == 'tea-question'"
                @updateSelected="updateSelected" jumpToPath="message" />
            <control-panel-item id="tea-settings" icon="settings-2" size="30px"
                :clicked="selectedItem == 'tea-settings'" @updateSelected="updateSelected" jumpToPath="setting" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import ControlPanelItem from '@/components/control-panel-item';

defineProps({
    deviceType: String,
    userType: String
})

// 选择高亮组件
const selectedItem = ref<string>('');
const updateSelected = (id: string) => {
    selectedItem.value = id;
};
</script>

<style scoped lang="scss">
.footer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 6dvh;
    padding: 0 10vw 0 10vw;
}
</style>