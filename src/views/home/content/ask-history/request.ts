import request from "@/utils/http/request";
import type { HistoryQuestion } from "./AskHistory";

interface ResponseData<T = any> {
    code: number;
    message: string;
    data?: T;
}

export interface GetPageHistoryRequest {
    page_idx: number;
}

export interface GetPageHistoryResponse {
    page_history_question_list: HistoryQuestion[];
    total: number;
    size: number;
    remain_page: number;
    page_num: number;
}

export async function GetPage(
    data: GetPageHistoryRequest
): Promise<GetPageHistoryResponse> {
    return request<ResponseData, any>({
        url: "/history",
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
