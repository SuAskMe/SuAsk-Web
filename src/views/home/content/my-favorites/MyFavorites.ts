import {
    Get,
    type GetFavoriteResponse,
    GetPage,
    type GetPageFavoriteResponse,
    type GetPageFavoriteRequest,
} from "./request";

export interface FavoriteQuestion {
    id: number;
    title: string;
    contents: string;
    views: number;
    favorite_at: number;
    // image_urls: string[];
}

export interface PageOutput {
    list: FavoriteQuestion[];
    total: number;
    size: number;
}

// export async function GetFavoriteList(): Promise<FavoriteQuestion[]> {
// // page: number
//     var res: GetFavoriteResponse;
//     res = await Get();
//     if (res.favorite_question_list) {
//         return res.favorite_question_list;
//     } else {
//         console.log("空的！");
//         return [];
//     }
// }

export async function GetPageFavoriteList(
    page: number
): Promise<PageOutput> {
    var req: GetPageFavoriteRequest = { page_idx: page };
    var res: GetPageFavoriteResponse;
    res = await GetPage(req);
    if (res.page_favorite_question_list) {
        var output: PageOutput = {
            list: res.page_favorite_question_list,
            total: res.total,
            size: res.size,
        };
        return output;
    } else {
        console.log("空的！");
        var output: PageOutput = {
            list: [],
            total: 0,
            size: 0,
        };
        return output;
    }
}
