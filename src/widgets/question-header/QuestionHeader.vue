<template>
    <PageHeader :title="props.title" :show-title="!searchActive">
        <template #left>
            <div v-if="return_btn" class="return-btn" @click.stop="$emit('return')">
                <svg-icon icon="arrow-left" color="#71B6FF" size="30px" />
            </div>
            <SidebarToggle v-if="sidebar_btn" @toggle="$emit('sidebar')" />
        </template>
        <template #right>
            <template v-if="props.sort_and_search">
                <SortDropdown
                    v-if="!searchActive"
                    v-model="sortIndex"
                    :has-sort-upvote="props.has_sort_upvote"
                    @change="changeSort"
                />
                <QuestionSearchBox
                    v-if="props.search"
                    :get-keywords-url="props.get_keywords_url"
                    :teacher-id="props.teacher_id"
                    :sort-type="sortIndex"
                    :mobile="deviceType.isMobile"
                    @search="$emit('search', $event)"
                    @cancel-search="$emit('cancelSearch')"
                    @update:active="searchActive = $event"
                />
            </template>
        </template>
    </PageHeader>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue'
import QuestionSearchBox from './QuestionSearchBox.vue'
import SidebarToggle from './SidebarToggle.vue'
import SortDropdown from './SortDropdown.vue'
import { DeviceTypeStore } from '@/app/store/modules/device-type'
import { ref } from 'vue'
const emit = defineEmits(['changeSort', 'search', 'cancelSearch', 'return', 'sidebar'])

const deviceType = DeviceTypeStore()

const props = withDefaults(
    defineProps<{
        title?: string
        get_keywords_url?: string
        return_btn?: boolean
        sidebar_btn?: boolean
        search?: boolean
        has_sort_upvote?: boolean
        default_sort_type?: number
        sort_and_search?: boolean
        teacher_id?: number
    }>(),
    {},
)

const sortIndex = ref(props.default_sort_type || 0)
const searchActive = ref(false)

function changeSort(index: number) {
    sortIndex.value = index
    emit('changeSort', index)
}
</script>

<style scoped lang="scss">
.return-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>
