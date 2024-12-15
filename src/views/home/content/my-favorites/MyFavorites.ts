import {
    Get,
    type GetFavoritesResponse,
} from "./request";

export interface FavoritesQuestion {
    id: number;
    title: string;
    contents: string;
    views: number;
    star_at: number; 
    // image_urls: string[];
}

export async function GetFavoritesList(
    // page: number
): Promise<FavoritesQuestion[]> {
    var res: GetFavoritesResponse;
    res = await Get();
    if (res.star_question_list) {
        return res.star_question_list;
    } else {
        return [];
    }
}