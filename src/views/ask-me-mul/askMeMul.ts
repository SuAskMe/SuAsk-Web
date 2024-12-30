import { ElMessage } from "element-plus";
import type { GetQFMRes, QFMItem } from "@/model/teacher-self.model";
import {
    getQFMAnsweredApi,
    getQFMOnTopApi,
    getQFMUnansweredApi,
    pinQFMApi,
} from "@/api/question/teacher-self.api";

let Api = getQFMAnsweredApi;
let isEnd = false;
let currentPage = 1;
let sortType = -1;
let alock = false;

export function setAnsweredOrNot(type: string): void {
    switch (type) {
        case "answered":
            Api = getQFMAnsweredApi;
            break;
        case "unanswered":
            Api = getQFMUnansweredApi;
            break;
        case "top":
            Api = getQFMOnTopApi;
            break;
    }
}

export async function getNextQuestions(sortType_?: number): Promise<QFMItem[]> {
    // let mock = mockQuestions();
    // return mock.question_list;
    if (alock) {
        return new Promise<QFMItem[]>((resolve) => {
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
    } else {
        currentPage++;
    }
    if (isEnd) {
        ElMessage({ message: "没有更多了", type: "success" });
        return new Promise<QFMItem[]>((resolve) => {
            resolve([]);
        });
    }
    // console.log("getNextQuestions", sortType, currentPage);
    return getQuestionsByPage(sortType, currentPage);
}

async function getQuestionsByPage(
    sortType: number,
    page: number
): Promise<QFMItem[]> {
    var res: GetQFMRes;
    res = await Api({
        sort_type: sortType,
        page: page,
    });
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
