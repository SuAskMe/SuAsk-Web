<template>
    <div :class="isMobile ? 'type-writer-phone' : 'type-writer-web'">
        <span> {{ typingText }} </span>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';

const props = defineProps({
    optionalText: {
        type: Array<String>,
        default: ['开启你的问答之旅吧'],
    },
    isMobile: {
        type: Boolean,
        default: false,
    },
})

const typingText = ref('');
const index = ref(0);
const optionalText = ref(getRandomText());

function getRandomText() {
    return props.optionalText[Math.floor(Math.random() * props.optionalText.length)];
}

function startTyping() {
    index.value++;
    typingText.value = optionalText.value.slice(0, index.value);
    if (index.value < optionalText.value.length) {
        setTimeout(startTyping, 100);
    } else {
        index.value = 0;
        setTimeout(startTyping, 3000);
        optionalText.value = getRandomText();
    }
}

onMounted(() => {
    getRandomText();
    startTyping();
});
</script>

<style>
.type-writer-web span {
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    border-right: 2px solid #71B6FF;
    animation: blink 0.7s steps(2) infinite;
    font-size: 4dvh;
    color: #71B6FF;
}

.type-writer-phone span {
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    border-right: 2px solid #71B6FF;
    animation: blink 0.7s steps(2) infinite;
    font-size: 3dvh;
    color: #71B6FF;
}

@keyframes blink {
    0% {
        border-color: #71B6FF;
    }

    50% {
        border-color: transparent;
    }

    100% {
        border-color: #71B6FF;
    }
}
</style>