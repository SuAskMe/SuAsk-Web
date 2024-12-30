import { ref } from 'vue';

// 选择高亮组件
const selectedItem = ref<string>('');
const updateSelected = (id: string) => {
    selectedItem.value = id;
};

export { selectedItem, updateSelected };
