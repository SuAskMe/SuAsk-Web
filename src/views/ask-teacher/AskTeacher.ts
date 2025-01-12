import { favoriteApi } from "@/api/question/favorite.api";
import {
    getQuestionTeacherApi,
    searchQuestionTeacherApi,
} from "@/api/question/question.api";
import type { GetQuestionRes, QuestionItem } from "@/model/question.model";
import { ElMessage } from "element-plus";

let isEnd_at = false;
let currentPage_at = 1;
let sortType_at = -1;
let keyword_at = "";
let alock_at = false;

export function InitStatus() {
    isEnd_at = false;
    currentPage_at = 1;
    sortType_at = -1;
    keyword_at = "";
    alock_at = false;
}

export async function getNextQuestions(
    teacher_id: number,
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean
): Promise<QuestionItem[]> {
    if (sortType_ !== undefined && sortType_ !== sortType_at) {
        currentPage_at = 1;
        sortType_at = sortType_;
        isEnd_at = false;
    } else if (keyword_ !== undefined && keyword_ !== keyword_at) {
        currentPage_at = 1;
        keyword_at = keyword_;
        isEnd_at = false;
    } else {
        currentPage_at++;
    }
    if (cancelSearch) {
        keyword_at = "";
        currentPage_at = 1;
        isEnd_at = false;
    }
    if (isEnd_at) {
        if (!alock_at) {
            alock_at = true;
            ElMessage({ message: "没有更多了", type: "success" });
        }
        setTimeout(() => {
            alock_at = false;
        }, 2000);
        return new Promise<QuestionItem[]>((resolve) => {
            resolve([]);
        });
    }
    // console.log("getNextQuestions", sortType, currentPage);
    return getQuestionsByPage(
        sortType_at,
        currentPage_at,
        keyword_at,
        teacher_id
    );
}

async function getQuestionsByPage(
    sortType: number,
    page: number,
    keyword: string,
    teacher_id: number
): Promise<QuestionItem[]> {
    var res: GetQuestionRes;
    if (keyword !== "") {
        res = await searchQuestionTeacherApi({
            teacher_id: teacher_id,
            keyword: keyword,
            sort_type: sortType,
            page: page,
        });
    } else {
        res = await getQuestionTeacherApi({
            sort_type: sortType,
            page: page,
            teacher_id: teacher_id,
        });
    }
    if (res.remain_page <= 0) {
        isEnd_at = true;
    }
    if (res.question_list) {
        // console.log(res);
        return res.question_list;
    } else {
        return [];
    }
}

export async function Favorite(question_id: number): Promise<boolean> {
    var res = await favoriteApi({ question_id });
    if (res) {
        return res.is_favorite;
    } else {
        ElMessage.error("请求失败");
        return false;
    }
}
