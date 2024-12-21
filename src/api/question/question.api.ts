import type { QuestionBase } from "@/model/question.model";
import request from "@/utils/http/request";

enum Api {
    Add = '/questions/add',
}

export async function addQuestionApi(question: QuestionBase) {
    return request.post(Api.Add, question);
}