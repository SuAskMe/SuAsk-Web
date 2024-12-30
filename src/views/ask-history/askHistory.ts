import { favoriteApi } from "@/api/question/favorite.api";
import { searchHistoryApi, getHistoryApi } from "@/api/question/history.api";
import type { HistoryItem, GetHistoryRes } from "@/model/history.model";
import { ElMessage } from "element-plus";

let isEnd = false;
let currentPage = 1;
let sortType = -1;
let keyword = "";
let alock = false;

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean
): Promise<HistoryItem[]> {
    if (alock) {
        return new Promise<HistoryItem[]>((resolve) => {
            resolve([]);
        });
    }
    alock = true;
    setTimeout(() => {
        alock = false;
    }, 2000);
    if (sortType_ !== undefined && sortType_ !== sortType) {
        currentPage = 1;
        sortType = sortType_;
        isEnd = false;
    } else if (keyword_ !== undefined && keyword_ !== keyword) {
        currentPage = 1;
        keyword = keyword_;
        isEnd = false;
    } else {
        currentPage++;
    }
    if (cancelSearch) {
        keyword = "";
        currentPage = 1;
        isEnd = false;
    }
    if (isEnd) {
        ElMessage.success("没有更多了");
        return new Promise<HistoryItem[]>((resolve) => {
            resolve([]);
        });
    }
    return await getQuestionsByPage(sortType, currentPage, keyword);
}

async function getQuestionsByPage(
    sortType: number,
    page: number,
    keyword: string
): Promise<HistoryItem[]> {
    var res: GetHistoryRes;
    if (keyword !== "") {
        res = await searchHistoryApi({
            keyword,
            sort_type: sortType,
            page: page,
        });
    } else {
        res = await getHistoryApi({ sort_type: sortType, page: page });
    }
    if (res.remain_page <= 0) {
        isEnd = true;
    }
    if (res.favorite_list) {
        return res.favorite_list;
    } else {
        return [];
    }
}

export async function Favorite(question_id: number): Promise<boolean | null> {
    var res = await favoriteApi({ question_id });
    if (res) {
        return res.is_favorite;
    }
    ElMessage.error("请求失败");
    return null;
}
