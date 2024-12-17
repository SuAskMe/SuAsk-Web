import { ElMessage } from "element-plus";
import {
    FavoriteRequest,
    GetAskAll,
    GetAskAllByKeyword,
    type GetAskAllResponse,
} from "./request";

export interface QuestionItem {
    id: number;
    title: string;
    contents: string;
    views: number;
    created_at: number;
    image_urls: string[];
    is_favorited: boolean;
    answer_num: number;
    answer_avatars: string[];
}

let isEnd = false;
let currentPage = 1;
let sortType = -1;
let keyword = "";

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
        ElMessage({ message: "没有更多了", type: "success" });
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
    var res: GetAskAllResponse;
    if (keyword !== "") {
        res = await GetAskAllByKeyword({
            keyword: keyword,
            sort_type: sortType,
            page: page,
            user_id: 1,
        });
    } else {
        res = await GetAskAll({
            sort_type: sortType,
            page: page,
            user_id: 1,
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

export async function Favorite(question_id: number): Promise<boolean> {
    var res = await FavoriteRequest({ question_id, user_id: 1 });
    if (res) {
        return res.is_favorited;
    } else {
        ElMessage({ message: "请求失败", type: "error" });
        return false;
    }
}

// const questions: QuestionItem[] = [
//     {
//         id: 1,
//         title: "测试页面",
//         text: "测试页面的文本内容测试页",
//         views: 1000,
//         created_at: new Date().getTime(),
//         image_urls: imagesUrls,
//         is_favourite: false,
//         answer_num: 0,
//         answer_avatars: [],
//     },
//     {
//         id: 2,
//         title: "测试页面",
//         text: "测试页面的文本内容测试页",
//         views: 1000,
//         created_at: new Date().getTime(),
//         image_urls: imagesUrls,
//         is_favourite: false,
//         answer_num: 1,
//         answer_avatars: ["src/assets/default_avatar.png"],
//     },
//     {
//         id: 1,
//         title: "测试页面",
//         text: "测试页面的文本内容测试页",
//         views: 1000,
//         created_at: new Date().getTime(),
//         image_urls: imagesUrls,
//         is_favourite: false,
//         answer_num: 0,
//         answer_avatars: [],
//     },
//     {
//         id: 2,
//         title: "测试页面",
//         text: "测试页面的文本内容测试页",
//         views: 1000,
//         created_at: new Date().getTime(),
//         image_urls: imagesUrls,
//         is_favourite: false,
//         answer_num: 1,
//         answer_avatars: ["src/assets/default_avatar.png"],
//     },
// ];
