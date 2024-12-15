import request from "@/utils/http/request";
import type { FavoritesQuestion } from "./MyFavorites";

interface ResponseData<T = any> {
    code: number;
    message: string;
    data?: T;
}

interface GetFavoritesRequest {
    // page: number;
    // user_id: number;
}

export interface GetFavoritesResponse {
    star_question_list: FavoritesQuestion[];
    // remain_page: number;
}

export async function Get(
    // data: GetFavoritesRequest
): Promise<GetFavoritesResponse> {
    return request<ResponseData, any>({
        url: "/star/get",
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