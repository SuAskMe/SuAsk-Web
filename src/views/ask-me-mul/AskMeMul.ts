import { ElMessage } from "element-plus";
import type { GetQFMRes, QFMItem } from "@/model/teacher-self.model";
import {
    getQFMAnsweredApi,
    getQFMOnTopApi,
    getQFMUnansweredApi,
    pinQFMApi,
} from "@/api/question/teacher-self.api";

let Api = getQFMAnsweredApi;
let isEnd_amm = false;
let currentPage_amm = 1;
let sortType_amm = -1;
let alock_amm = false;

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

export function InitStatus(type: string): void {
    isEnd_amm = false;
    currentPage_amm = 1;
    sortType_amm = -1;
    alock_amm = false;
    setAnsweredOrNot(type);
}



export async function getNextQuestions(sortType_?: number): Promise<QFMItem[]> {
    // let mock = mockQuestions();
    // return mock.question_list;
    if (sortType_ !== undefined && sortType_ !== sortType_amm) {
        currentPage_amm = 1;
        sortType_amm = sortType_;
        isEnd_amm = false;
    } else {
        currentPage_amm++;
    }
    if (isEnd_amm) {
        if (!alock_amm) {
            alock_amm = true;
            ElMessage({ message: "没有更多了", type: "success" });
        }
        setTimeout(() => {
            alock_amm = false;
        }, 2000);

        return new Promise<QFMItem[]>((resolve) => {
            resolve([]);
        });
    }
    // console.log("getNextQuestions", sortType, currentPage);
    return getQuestionsByPage(sortType_amm, currentPage_amm);
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
        isEnd_amm = true;
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
