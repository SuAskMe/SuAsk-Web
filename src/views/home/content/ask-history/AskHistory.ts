import {
    GetPage,
    type GetPageHistoryResponse,
    type GetPageHistoryRequest,
} from "./request";

export interface HistoryQuestion {
    id: number;
    title: string;
    contents: string;
    views: number;
    created_at: string;
    image_urls: string[];
}

export interface PageOutput {
    list: HistoryQuestion[];
    total: number;
    size: number;
}

export async function GetPageHistoryList(
    page: number
): Promise<PageOutput> {
    var req: GetPageHistoryRequest = { page_idx: page };
    var res: GetPageHistoryResponse;
    res = await GetPage(req);
    if (res.page_history_question_list) {
        var output: PageOutput = {
            list: res.page_history_question_list,
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
