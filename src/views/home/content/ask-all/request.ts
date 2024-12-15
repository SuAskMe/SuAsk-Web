import request from "@/utils/http/request";
import type { QuestionItem } from "./AskAll";

interface ResponseData<T = any> {
    code: number;
    message: string;
    data?: T;
}

interface GetAskAllParams {
    page: number;
    user_id: number;
    sort_type: number;
}

interface GetAskAllByKeywordParams {
    page: number;
    keyword: string;
    user_id: number;
    sort_type: number;
}

export interface GetAskAllResponse {
    question_list: QuestionItem[];
    remain_page: number;
}

interface GetKeyWordsParams {
    sort_type: number;
    keyword: string;
}

interface GetKeyWordsResponse {
    words: { value: string }[];
}

export async function GetAskAll(
    data: GetAskAllParams
): Promise<GetAskAllResponse> {
    return request<ResponseData, any>({
        url: "/questions/public/get",
        method: "get",
        params: data,
    })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

export async function GetKeyWords(
    data: GetKeyWordsParams
): Promise<GetKeyWordsResponse> {
    return request<ResponseData, any>({
        url: "/questions/public/get/keywords",
        method: "get",
        params: data,
    })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

export async function GetAskAllByKeyword(
    data: GetAskAllByKeywordParams
): Promise<GetAskAllResponse> {
    return request<ResponseData, any>({
        url: "/questions/public/search",
        method: "get",
        params: data,
    })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
