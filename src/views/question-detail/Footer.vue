<template>
    <div class="footer-container" @keyup.enter="handleEnter">
        <el-input v-model="inputText" placeholder="请输入内容" type="textarea" autosize style="width: 60%" maxlength="500"
            @input="handleInput"></el-input>
        <div class="svg-container">
            <SvgIcon icon="image" size="24px" color="#808080" hover-color="#71b6ff" style="cursor: pointer"
                @click.stop="pickImage" />
            <input type="file" ref="imgPicker" accept="image/png,image/jpeg,image/jpg" style="display: none"
                @change="pickImageImpl" multiple />
        </div>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/svg-icon";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { GenId } from "./QuestionDetail";
import type { AddAnswer } from "@/model/answer.model";
import { addAnswerApi } from "@/api/answer/answer.api";

interface ReplyProps {
    question_id: number;
}
interface Img {
    id: number;
    url: string;
}
const props = defineProps<ReplyProps>();
const inputText = ref("");
const handleInput = (val: string) => {
    inputText.value = val.replaceAll("\r", "");
    inputText.value = val.replaceAll("\n", "");
};
const handleEnter = async () => {
    // alert("你输入的内容是：" + inputText.value);
    if (inputText.value === "") {
        ElMessage.error("请输入内容");
        return;
    }
    let req: AddAnswer = {
        question_id: props.question_id,
        content: inputText.value,
    };

    let formData = new FormData();
    for (let i = 0; fileList.value && i < fileList.value.length; i++) {
        formData.append("files", fileList.value[i]);
    }
    formData.append('question_id', req.question_id.toString());
    formData.append('content', req.content);
    await addAnswerApi(formData).then((res) => {
        console.log(res);
        fileList.value = [];
        imageList.value = [];
    });
    inputText.value = "";
};
const imgPicker = ref<HTMLInputElement>();
const pickImage = () => {
    if (imgPicker.value) {
        imgPicker.value.click();
    }
};
const fileList = defineModel("fileList", { type: Array<File> });
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
