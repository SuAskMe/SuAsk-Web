<template>
    <div class="teacher-list">
        <h1>教师</h1>
        <div class="teacher-grid">
            <div
                v-for="teacher in teachers"
                :key="teacher.name"
                class="teacher-card"
            >
                <img
                    :src="teacher.avatar"
                    alt="Teacher Avatar"
                    class="teacher-avatar"
                />
                <h2>{{ teacher.name }}</h2>
                <p><strong>现任职务：</strong>{{ teacher.position }}</p>
                <p><strong>研究方向：</strong>{{ teacher.research }}</p>
                <p v-if="teacher.email">
                    <strong>Email:</strong> {{ teacher.email }}
                </p>
                <a href="#" class="teacher-question-btn">向他提问</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
const teachers = reactive([
    {
        name: "郑子彬",
        avatar: "https://via.placeholder.com/150", // 替换为实际图片地址
        position: "院长",
        research: "软件可靠性、程序分析、区块链、智能合约、可信软件。本科...",
        email: null,
    },
    {
        name: "余阳",
        avatar: "https://via.placeholder.com/150",
        position: "",
        research: "工作流/BPM、服务计算/云计算、网络社会协作、软件工程。",
        email: "yuy@mail.sysu.edu.cn",
    },
    {
        name: "王国利",
        avatar: "https://via.placeholder.com/150",
        position: "",
        research: "普适计算、泛在感知与泛在智能。",
        email: null,
    },
    {
        name: "王若梅",
        avatar: "https://via.placeholder.com/150",
        position: "",
        research:
            "计算机图形学理论和应用，三维计算机仿真，视频数据分析与处理。",
        email: null,
    },
    {
        name: "周育人",
        avatar: "https://via.placeholder.com/150",
        position: "",
        research: "算法设计与分析，演化算法。",
        email: null,
    },
    {
        name: "陈武辉",
        avatar: "https://via.placeholder.com/150",
        position: "",
        research: "大模型系统、大模型训练与推理加速、端侧大模型。",
        email: "chenwuh@mail.sysu.edu.cn",
    },
]);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap");
body {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    box-sizing: border-box;
}
.teacher-list {
    padding: 16px;
    max-width: 1200px;
    margin: auto;
}
h1 {
    font-size: 2em;
    margin-bottom: 16px;
    text-align: center;
}
.teacher-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}
.teacher-card {
    border: 1px solid #ddd;
    padding: 16px;
    text-align: left;
}
.teacher-avatar {
    width: 100%;
    max-width: 150px;
    margin-bottom: 8px;
    border-radius: 8px;
}
.more-link {
    color: #007bff;
    text-decoration: none;
    margin-top: 8px;
    display: inline-block;
}
.more-link:hover {
    text-decoration: underline;
}
@media (max-width: 768px) {
    .teacher-list {
        padding: 10px;
    }

    .title {
        font-size: 1.5em;
    }

    .teacher-card {
        padding: 12px;
    }

    .teacher-avatar {
        max-width: 120px;
    }

    .teacher-question-btn {
        font-size: 12px;
        padding: 6px 10px;
    }
}

@media (max-width: 480px) {
    .teacher-grid {
        grid-template-columns: 1fr;
    }

    .teacher-avatar {
        max-width: 100px;
    }

    .title {
        font-size: 1.2em;
    }

    .teacher-card {
        padding: 8px;
    }

    .teacher-question-btn {
        font-size: 12px;
        padding: 5px 8px;
    }
}
</style>
