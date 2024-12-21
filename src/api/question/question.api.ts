import request from "@/utils/http/request";

enum Api {
    Add = '/questions/add',
}

export async function addQuestionApi(question: FormData) {
    return request.post(Api.Add, question);
}