<template>
    <el-card
        @click.stop="clickCard(teacherKey)"
        shadow="hover"
        class="teacher-card"
        :style="teacher.perm == 'private' ? 'opacity: 0.5' : ''"
    >
        <div class="card-left">
            <img
                :src="teacher.avatarUrl"
                class="teacher-avatar"
                loading="lazy"
            />
            <el-button
                class="teacher-btn"
                @click.stop="clickBtn(teacherKey)"
                round
                >Ta的主页</el-button
            >
        </div>
        <div class="card-right">
            <div class="teacher-info">
                <div class="teacher-name">{{ teacher.name }}</div>

                <div class="teacher-title">教师简介：</div>
                <div class="teacher-introduction">
                    {{ teacher.introduction }}
                </div>
                <div class="teacher-title">教师邮箱：</div>
                <div class="teacher-email">{{ teacher.email }}</div>
            </div>
        </div>

        <div class="card-corner">
            <svg-icon icon="chat-history" size="20" color="#808080" />
            <div class="card-corner-text">{{ teacher.responses }}</div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import type { TeacherItem } from "@/model/teacher.model";
import { preview } from "vite";

interface CardProps {
    teacher: TeacherItem;
    clickCard?: (key: any) => void;
    clickBtn?: (key: any) => void;
    teacherKey?: any;
}
const props = withDefaults(defineProps<CardProps>(), {
    clickCard: () => {},
    clickBtn: () => {},
});
// console.log(props.teacher.avatarUrl);
</script>
<style scoped lang="scss">
.teacher-card {
    position: relative;
    width: 40%;
    height: 240px;
    border-radius: 8px;
    padding: 0;
    user-select: none;
}

.card-left {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 35%;
    height: 100%;
    background-color: $su-blue-light;
    gap: 30px;

    .teacher-avatar {
        width: 70%;
        border-radius: 50%;
        aspect-ratio: 1/1;
        object-fit: cover;
        object-position: center top;
        border: solid 2px #fff;
    }

    .teacher-btn {
        border: 0;
        background-color: #80808030;
        padding: 0px 10px;
        height: calc(1em + 10px);
        color: #fff;

        &:hover {
            color: $su-blue;
        }
    }
}

.card-right {
    position: absolute;
    display: flex;
    right: 0;
    top: 0;
    width: 65%;
    height: 100%;

    .teacher-info {
        display: flex;
        flex-direction: column;
        padding: 12px;

        .teacher-name {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 20px;
            margin-top: 20px;
            color: $su-blue-dark;
        }

        .teacher-title {
            font-size: 1em;
            font-weight: bold;
            margin-bottom: 5px;
            color: $su-blue;
        }

        .teacher-email {
            font-size: 1em;
            line-height: 1.25;
            margin-bottom: 10px;
            color: $su-grey;
        }

        .teacher-introduction {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            font-size: 1em;
            line-height: 1.25;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 10px;
            color: $su-grey;
        }
    }
}

.card-corner {
    position: absolute;
    right: 0;
    top: 0;
    background-color: $su-yellow;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom-left-radius: 20px;
    padding: 5px 15px;
    gap: 5px;

    .card-corner-text {
        font-size: 14px;
        color: $su-grey;
    }
}
</style>
