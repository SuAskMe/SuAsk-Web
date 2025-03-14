<template>
    <div class="control-panel-items">
        <control-panel-item
            class="control-panel-item"
            id="ask-all"
            icon="group"
            text="问大家"
            jump-to-path="/ask-all"
        />
        <control-panel-item
            class="control-panel-item"
            id="ask-teacher"
            icon="graduation-cap"
            text="问老师"
            jump-to-path="/ask-teacher"
        />
        <div class="menu-container">
            <div
                @click="toggleOpen"
                style="display: flex; align-items: center"
                class="control-panel-item"
            >
                <control-panel-item
                    id="question"
                    icon="message"
                    text="我的提问箱"
                    jumpToPath="/ask-me"
                />
                <svg-icon
                    v-if="!isOpen"
                    icon="arrow-left"
                    color="#808080"
                    size="24px"
                    style="padding-top: 2px"
                />
                <svg-icon
                    v-if="isOpen"
                    icon="arrow-down"
                    color="#808080"
                    size="24px"
                    style="padding-top: 2px"
                />
            </div>
            <div class="submenu-wrapper" :style="{ height: isOpen ? submenuHeight + 'px' : '0' }">
                <div class="menu-items" ref="menuItemsRef">
                    <control-panel-item
                        class="control-panel-item"
                        id="question-new"
                        text="新的提问"
                        jumpToPath="/ask-me/unanswered"
                    />
                    <control-panel-item
                        class="control-panel-item"
                        id="question-old"
                        text="已回答提问"
                        jumpToPath="/ask-me/answered"
                    />
                    <control-panel-item
                        class="control-panel-item"
                        id="question-top"
                        text="置顶提问"
                        jumpToPath="/ask-me/top"
                    />
                </div>
            </div>
        </div>
        <control-panel-item
            class="control-panel-item"
            id="ask-history"
            icon="chat-history"
            text="历史提问"
            jump-to-path="/ask-history"
        />
        <control-panel-item
            class="control-panel-item"
            id="star"
            icon="star"
            text="我的收藏"
            jump-to-path="/my-favorite"
        />
        <control-panel-item
            class="control-panel-item"
            id="settings"
            icon="settings"
            text="设置"
            jumpToPath="/setting"
        />
        <control-panel-item
            class="control-panel-item"
            id="help"
            icon="question"
            text="帮助"
            jumpToPath="/help"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ControlPanelItem from '@/components/control-panel-item'

const isOpen = ref(false)
const menuItemsRef = ref()
const submenuHeight = ref(0)

async function toggleOpen() {
    isOpen.value = !isOpen.value

    if (isOpen.value) {
        await nextTick()
        submenuHeight.value = menuItemsRef.value.scrollHeight
    } else {
        submenuHeight.value = 0
    }
}

onMounted(async () => {
    await nextTick()
    if (menuItemsRef.value) {
        submenuHeight.value = isOpen.value ? menuItemsRef.value.scrollHeight : 0
    }
})
</script>

<style scoped lang="scss">
$item-gap: 20px;

.control-panel-items {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    gap: $item-gap;
    transition: all 0.3s ease;

    .control-panel-item {
        transition: all 0.3s ease;
    }

    .menu-container {
        display: flex;
        flex-direction: column;
    }

    .submenu-wrapper {
        overflow: hidden;
        transition: height 0.3s ease;
    }

    .menu-items {
        display: flex;
        flex-direction: column;
        gap: $item-gap;
        padding: 20px 0 0 24px;
    }

    .control-panel-item:hover {
        transform: translateX(10px);
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
