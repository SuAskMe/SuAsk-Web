<template>
    <div v-if="deviceType == 'phone'">
        <div v-if="user == 'student'" class="footer-item">
            <control-panel-item id="stu-ask-all" icon="group" size="30px" :clicked="selectedItem == 'stu-ask-all'"
                @updateSelected="updateSelected" />
            <control-panel-item id="stu-ask-teacher" icon="graduation-cap" size="30px"
                :clicked="selectedItem == 'stu-ask-teacher'" @updateSelected="updateSelected" />
            <control-panel-item id="stu-message" icon="chat-1" size="30px" :clicked="selectedItem == 'stu-message'"
                @updateSelected="updateSelected" />
            <control-panel-item id="stu-settings" icon="settings-2" size="30px"
                :clicked="selectedItem == 'stu-settings'" @updateSelected="updateSelected" />
        </div>
        <div v-if="user == 'teacher'" class="footer-item">
            <control-panel-item id="tea-see-all" icon="camera-lens" size="30px" :clicked="selectedItem == 'tea-see-all'"
                @updateSelected="updateSelected" />
            <control-panel-item id="tea-question" icon="message" size="30px" :clicked="selectedItem == 'tea-question'"
                @updateSelected="updateSelected" />
            <control-panel-item id="tea-settings" icon="settings-2" size="30px"
                :clicked="selectedItem == 'tea-settings'" @updateSelected="updateSelected" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import ControlPanelItem from '@/components/control-panel-item';

defineProps({
    deviceType: String,
    user: String
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