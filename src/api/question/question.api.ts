import request from "@/utils/http/request";

enum Api {
    ADD = '/questions/add',

}

export async function addQuestionApi(question: FormData) {
    return request.post(Api.ADD, question);
}