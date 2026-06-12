<template>
    <div :class="isMobile ? 'type-writer-phone' : 'type-writer-web'">
        <span> {{ typingText }} </span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
    optionalText: {
        type: Array<string>,
        default: ['开启你的问答之旅吧'],
    },
    isMobile: {
        type: Boolean,
        default: false,
    },
})

const typingText = ref('')
const index = ref(0)
const currentText = ref(getRandomText())

function getRandomText() {
    return props.optionalText[Math.floor(Math.random() * props.optionalText.length)]
}

function startTyping() {
    index.value++
    typingText.value = currentText.value.slice(0, index.value)
    if (index.value < currentText.value.length) {
        setTimeout(startTyping, 100)
    } else {
        index.value = 0
        setTimeout(startTyping, 3000)
        currentText.value = getRandomText()
    }
}

onMounted(() => {
    getRandomText()
    startTyping()
})
</script>

<style>
.type-writer-web span {
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    border-right: 2px solid #71b6ff;
    animation: blink 0.7s steps(2) infinite;
    font-size: 4dvh;
    color: #71b6ff;
}

.type-writer-phone span {
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    border-right: 2px solid #71b6ff;
    animation: blink 0.7s steps(2) infinite;
    font-size: 3dvh;
    color: #71b6ff;
}

@keyframes blink {
    0% {
        border-color: #71b6ff;
    }

    50% {
        border-color: transparent;
    }

    100% {
        border-color: #71b6ff;
    }
}
</style>
