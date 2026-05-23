<template>
    <el-dropdown class="header-item">
        <span class="dropdown">
            {{ options[modelValue] }}
            <svg-icon icon="sort-down" color="#71B6FF" size="22px" />
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="(item, index) in options"
                    :key="index"
                    @click="changeSort(index)"
                >
                    {{ item }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue?: number
        hasSortUpvote?: boolean
    }>(),
    {
        modelValue: 0,
        hasSortUpvote: false,
    },
)

const emit = defineEmits(['update:modelValue', 'change'])

const sortTextCommon = ['按时间降序', '按时间升序', '按热度降序', '按热度升序']
const sortTextWithoutUpvote = ['按时间降序', '按时间升序']

const options = computed(() => {
    return props.hasSortUpvote ? sortTextCommon : sortTextWithoutUpvote
})

function changeSort(index: number) {
    emit('update:modelValue', index)
    emit('change', index)
}
</script>

<style scoped lang="scss">
.header-item {
    display: flex;
    align-items: center;
}

.dropdown {
    cursor: pointer;
    color: $su-grey;
    display: flex;
    align-items: center;
    user-select: none;
    gap: 5px;

    &:focus-visible {
        outline: none;
    }
}
</style>
