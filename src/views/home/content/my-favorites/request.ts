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
    total: number;
    size: number;
    remain_page: number;
    page_num: number;
}

export async function Get(): Promise<GetFavoriteResponse> {
// data: GetFavoriteRequest
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

export interface GetPageFavoriteRequest {
    page_idx: number;
}

export interface GetPageFavoriteResponse {
    page_favorite_question_list: FavoriteQuestion[];
    total: number;
    size: number;
    remain_page: number;
    page_num: number;
}

export async function GetPage(
    data: GetPageFavoriteRequest
): Promise<GetPageFavoriteResponse> {
    return request<ResponseData, any>({
        url: "/favorite/getPage",
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
