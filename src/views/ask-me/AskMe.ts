import { ElMessage } from "element-plus";
import { favoriteApi } from "@/api/question/favorite.api";
import type { GetQFMRes, QFMItem } from "@/model/teacher-self.model";
import {
    getQFMAllApi,
    pinQFMApi,
    searchQFMApi,
} from "@/api/question/teacher-self.api";

let isEnd_am = false;
let currentPage_am = 1;
let sortType_am = -1;
let keyword_am = "";
let alock_am = false;

export function InitStatus() {
    isEnd_am = false;
    currentPage_am = 1;
    sortType_am = -1;
    keyword_am = "";
    alock_am = false;
}

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean
): Promise<QFMItem[]> {
    // let mock = mockQuestions();
    // return mock.question_list;
    if (sortType_ !== undefined && sortType_ !== sortType_am) {
        currentPage_am = 1;
        sortType_am = sortType_;
        isEnd_am = false;
    } else if (keyword_ !== undefined && keyword_ !== keyword_am) {
        currentPage_am = 1;
        keyword_am = keyword_;
        isEnd_am = false;
    } else {
        currentPage_am++;
    }
    if (cancelSearch) {
        keyword_am = "";
        currentPage_am = 1;
        isEnd_am = false;
    }
    if (isEnd_am) {
        if (!alock_am) {
            alock_am = true;
            ElMessage({ message: "没有更多了", type: "success" });
        }
        setTimeout(() => {
            alock_am = false;
        }, 2000);
        return new Promise<QFMItem[]>((resolve) => {
            resolve([]);
        });
    }
    // console.log("getNextQuestions", sortType, currentPage);
    return getQuestionsByPage(sortType_am, currentPage_am, keyword_am);
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
    console.log(res);
    if (res.remain_page <= 0) {
        isEnd_am = true;
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
