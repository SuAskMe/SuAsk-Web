import { ElMessage } from "element-plus";
import type { GetQuestionRes, QuestionItem } from "@/model/question.model";
import { favoriteApi } from "@/api/question/favorite.api";
import {
    getQuestionPublicApi,
    searchQuestionPublicApi,
} from "@/api/question/question.api";

let isEnd = false;
let currentPage = 1;
let sortType = -1;
let keyword = "";
let alock = false;

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean
): Promise<QuestionItem[]> {
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
        if (!alock) {
            alock = true;
            ElMessage({ message: "没有更多了", type: "success" });
        }
        setTimeout(() => {
            alock = false;
        }, 2000);
        return new Promise<QuestionItem[]>((resolve) => {
            resolve([]);
        });
    }
    // console.log("getNextQuestions", sortType, currentPage);
    return getQuestionsByPage(sortType, currentPage, keyword);
}

async function getQuestionsByPage(
    sortType: number,
    page: number,
    keyword: string
): Promise<QuestionItem[]> {
    var res: GetQuestionRes;
    if (keyword !== "") {
        res = await searchQuestionPublicApi({
            keyword: keyword,
            sort_type: sortType,
            page: page,
        });
    } else {
        res = await getQuestionPublicApi({
            sort_type: sortType,
            page: page,
        });
    }
    if (res.remain_page <= 0) {
        isEnd = true;
    }
    if (res.question_list) {
        return res.question_list;
    } else {
        return [];
    }
}

export async function Favorite(question_id: number): Promise<boolean | null> {
    var res = await favoriteApi({ question_id });
    if (res) {
        return res.is_favorite;
    } else {
        ElMessage.error("请求失败");
        return null;
    }
}
