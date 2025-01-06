import { ElMessage } from "element-plus";
import { favoriteApi } from "@/api/question/favorite.api";
import type { GetQFMRes, QFMItem } from "@/model/teacher-self.model";
import {
    getQFMAllApi,
    pinQFMApi,
    searchQFMApi,
} from "@/api/question/teacher-self.api";

let isEnd = false;
let currentPage = 1;
let sortType = -1;
let keyword = "";
let alock = false;

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean
): Promise<QFMItem[]> {
    // let mock = mockQuestions();
    // return mock.question_list;
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
        return new Promise<QFMItem[]>((resolve) => {
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
): Promise<QFMItem[]> {
    var res: GetQFMRes;
    if (keyword !== "") {
        res = await searchQFMApi({
            keyword: keyword,
            sort_type: sortType,
            page: page,
        });
    } else {
        res = await getQFMAllApi({
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

export async function Pin(question_id: number): Promise<boolean | null> {
    var res = await pinQFMApi({ question_id });
    if (res) {
        return res.is_pinned;
    } else {
        ElMessage.error("请求失败");
        return null;
    }
}
