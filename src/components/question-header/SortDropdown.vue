<template>
    <el-dropdown class="header-item" @visible-change="handleVisibleChange">
        <span class="dropdown">
            {{ options[currentIndex] }}
            <svg-icon 
                class="sort-icon" 
                :class="{ 'is-open': isOpen }" 
                icon="sort-down" 
                color="#71B6FF" 
                size="22px" 
            />
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="(item, index) in options"
                    :key="index"
                    :class="{ 'is-selected': index === currentIndex }"
                    @click="changeSort(index)"
                >
                    <div class="dropdown-item-content">
                        <span>{{ item }}</span>
                        <span v-if="index === currentIndex" class="check-mark">✓</span>
                    </div>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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

const isOpen = ref(false)
function handleVisibleChange(visible: boolean) {
    isOpen.value = visible
}

const sortTextCommon = ['时间', '热度']
const sortTextWithoutUpvote = ['时间']

const options = computed(() => {
    return props.hasSortUpvote ? sortTextCommon : sortTextWithoutUpvote
})

// 将后端传来的 modelValue (0或2) 映射为前端 options 的 index (0或1)
const currentIndex = computed(() => {
    return props.modelValue === 2 ? 1 : 0
})

function changeSort(index: number) {
    // 0 映射为 0 (时间)，1 映射为 2 (热度)
    const actualSortType = index === 1 ? 2 : 0
    emit('update:modelValue', actualSortType)
    emit('change', actualSortType)
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

.sort-icon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &.is-open {
        transform: rotate(180deg);
    }
}

.dropdown-item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: 80px;
    gap: 15px;
}

.check-mark {
    color: var(--su-blue-dark);
    font-weight: bold;
}

:deep(.el-dropdown-menu__item) {
    transition: all 0.2s ease;
    padding: 8px 16px;
    
    &.is-selected {
        color: var(--su-blue-dark) !important;
        background-color: var(--su-blue-light) !important;
        font-weight: 600;
    }
}
</style>
