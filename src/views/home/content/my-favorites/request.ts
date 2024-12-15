import request from "@/utils/http/request";
import type { FavoriteQuestion } from "./MyFavorites";

interface ResponseData<T = any> {
    code: number;
    message: string;
    data?: T;
}

interface GetFavoriteRequest {
    // page: number;
    // user_id: number;
}

export interface GetFavoriteResponse {
    favorite_question_list: FavoriteQuestion[];
    // remain_page: number;
}

export async function Get(
    // data: GetFavoriteRequest
): Promise<GetFavoriteResponse> {
    return request<ResponseData, any>({
        url: "/favorite/get",
        method: "get",
        // params: data,
    })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}