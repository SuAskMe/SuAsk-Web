<template>
    <div class="footer-container">
        <el-input
            v-model="inputTest"
            placeholder="请输入内容"
            type="textarea"
            autosize
            style="width: 60%"
            maxlength="150"
            show-word-limit
            @input="handleInput"
            @keyup.enter="handleEnter"
        ></el-input>
        <div class="svg-container">
            <SvgIcon
                icon="image"
                size="24px"
                color="#808080"
                hover-color="#71b6ff"
                style="cursor: pointer"
                @click.stop="pickImage"
            />
            <input
                type="file"
                ref="imgPicker"
                accept="image/png,image/jpeg,image/jpg"
                style="display: none"
                @change="pickImageImpl"
                multiple
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/svg-icon";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { GenId } from "./QuestionDetail";
interface Img {
    id: number;
    url: string;
}
const inputTest = ref("");
const handleInput = (val: string) => {
    inputTest.value = val.replaceAll("\r", "");
    inputTest.value = val.replaceAll("\n", "");
};
const handleEnter = () => {
    alert("你输入的内容是：" + inputTest.value);
    inputTest.value = "";
};
const imgPicker = ref<HTMLInputElement>();
const pickImage = () => {
    if (imgPicker.value) {
        imgPicker.value.click();
    }
};
const fileList = defineModel("fileList", { type: Array });
const imageList = defineModel("imageList", { type: Array });

const pickImageImpl = (event: any) => {
    if (fileList.value && imageList.value) {
        const files = event.target.files;
        if (fileList.value.length + files.length > 8) {
            ElMessage.error("最多只能上传8张图片");
            return;
        }
        fileList.value.push(...files);
        for (let i = 0; i < files.length; i++) {
            imageList.value.push({
                id: GenId(),
                url: URL.createObjectURL(files[i]),
            });
        }
        if (imgPicker.value) imgPicker.value.value = "";
        console.log(fileList.value, imageList.value);
    }
};
</script>

<style scoped lang="scss">
.footer-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 10px 0;
}

.svg-container {
    height: calc(1.25em + 10px);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 12px;
}
</style>

<style lang="scss">
.footer-container .el-textarea {
    .el-input__count {
        bottom: 8px;
    }
    .el-textarea__inner {
        border-radius: 20px;
        padding: 5px 15px;
        resize: none;
    }
}
</style>
