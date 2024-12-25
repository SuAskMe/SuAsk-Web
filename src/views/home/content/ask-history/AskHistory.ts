import {
    GetPage,
    type GetPageHistoryResponse,
    type GetPageHistoryRequest,
} from "./request";

export interface HistoryQuestion {
    id: number;
    title: string;
    contents: string;
    created_at: number;
    views: number;
    image_urls: string[];
}

export interface PageOutput {
    list: HistoryQuestion[];
    total: number;
    size: number;
    remain_page: number;
    page_num: number;
}

export async function GetPageHistoryList(
    page: number
): Promise<PageOutput> {
    var req: GetPageHistoryRequest = { page: page };
    var res: GetPageHistoryResponse;
    res = await GetPage(req);
    if (res.question_list) {
        var output: PageOutput = {
            list: res.question_list,
            total: res.total,
            size: res.size,
            remain_page: res.remain_page,
            page_num: res.page_num
        };
        return output;
    } else {
        console.log("空的！");
        var output: PageOutput = {
            list: [],
            total: 0,
            size: 0,
            remain_page: 1,
            page_num: 1,
        };
        return output;
    }
}
