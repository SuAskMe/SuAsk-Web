<template>
    <div class="control-panel-items">
        <control-panel-item
            class="control-panel-item"
            id="ask-teacher"
            icon="graduation-cap"
            text="问老师"
            jump-to-path="/ask-teacher"
        />
        <control-panel-item
            class="control-panel-item"
            id="hot"
            icon="hot"
            text="热点问题"
            jump-to-path="/hot"
        />
        <control-panel-item
            class="control-panel-item"
            id="admin-users"
            icon="manage"
            text="用户管理"
            jump-to-path="/admin/users"
        />
        <control-panel-item
            class="control-panel-item"
            id="admin-questions"
            icon="manage-2"
            text="内容管理"
            jump-to-path="/admin/questions"
        />
        <control-panel-item
            class="control-panel-item"
            id="admin-announcements"
            icon="pushpin"
            text="公告管理"
            :jump-to-path="ADMIN_ANNOUNCEMENTS_PATH"
        />
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
import ControlPanelItem from '@/components/control-panel-item'
import { ADMIN_ANNOUNCEMENTS_PATH } from '@/entities/announcement'
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
