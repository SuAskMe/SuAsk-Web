import {
    Get,
    type GetFavoriteResponse,
} from "./request";

export interface FavoriteQuestion {
    id: number;
    title: string;
    contents: string;
    views: number;
    favorite_at: string; 
    // image_urls: string[];
}

export async function GetFavoriteList(
    // page: number
): Promise<FavoriteQuestion[]> {
    var res: GetFavoriteResponse;
    res = await Get();
    if (res.favorite_question_list) {
        return res.favorite_question_list;
    } else {
        console.log("空的！");
        return [];
    }
}