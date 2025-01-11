<template>
    <div class="control-panel-e">
        <control-panel-item class="control-panel-item" id="ask-teacher" icon="graduation-cap" text="问老师"
            jump-to-path="/ask-teacher" />        
        <control-panel-item class="control-panel-item" id="help" icon="question" text="帮助" jump-to-path="/help" />
    </div>
</template>

<script setup lang='ts'>
import ControlPanelItem from '@/components/control-panel-item';
</script>

<style scoped lang="scss">
.control-panel-e {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    gap: 20px;

    .control-panel-item {
        transition: all 0.3s ease;
    }

    .control-panel-item:hover {
        transform: translateX(10px)
    }

    @keyframes slide-in-left {
        0% {
            transform: translateX(100px);
            opacity: 0;
        }

        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

}
</style>