<template>
    <VueCropper
        ref="cropper"
        :img="img"
        :auto-crop="true"
        :fixed="true"
        :fixed-number="[1, 1]"
        :center-box="true"
        output-type="png"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

defineProps<{
    img: string
}>()

const cropper = ref<{
    getCropBlob: (callback: (blob: Blob) => void) => void
} | null>(null)

function getCropBlob(callback: (blob: Blob) => void) {
    cropper.value?.getCropBlob(callback)
}

defineExpose({
    getCropBlob,
})
</script>
