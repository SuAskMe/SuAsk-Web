import { ElMessage } from "element-plus";
import type { GetQuestionRes, QuestionItem } from "@/model/question.model";
import { favoriteApi } from "@/api/question/favorite.api";
import {
    getQuestionPublicApi,
    searchQuestionPublicApi,
} from "@/api/question/question.api";
import Mock from "mockjs";

const Random = Mock.Random;

const mockQuestion = () => {
    const data: QuestionItem[] = Mock.mock({
        id: Random.integer(1, 1000000),
        title: Random.ctitle(5, 10),
        contents: Random.cparagraph(1, 3),
        views: Random.integer(100, 10000),
        created_at: new Date(Random.datetime()).getTime(),
        image_urls: [Random.image("200x100", Random.color(), Random.word(5))],
        is_favorited: Random.boolean(),
        answer_num: Random.integer(2, 10),
        answer_avatars: [
            // Random.image("120x120", Random.color(), Random.word(5)),
            // Random.image("120x120", Random.color(), Random.word(5)),
        ],
    });
    return data;
};

const mockQuestions = () => {
    let list = [];
    for (let i = 0; i < 10; i++) {
        list.push(mockQuestion());
    }
    const data = Mock.mock({
        question_list: list,
        remain_page: 0,
    });
    return data;
};

let isEnd = false;
let currentPage = 1;
let sortType = -1;
let keyword = "";

export async function getNextQuestions(
    sortType_?: number,
    keyword_?: string,
    cancelSearch?: boolean
): Promise<QuestionItem[]> {
    let mock = mockQuestions();
    return mock.question_list;
    // if (sortType_ !== undefined && sortType_ !== sortType) {
    //     currentPage = 1;
    //     sortType = sortType_;
    //     isEnd = false;
    // } else if (keyword_ !== undefined && keyword_ !== keyword) {
    //     currentPage = 1;
    //     keyword = keyword_;
    //     isEnd = false;
    // } else {
    //     currentPage++;
    // }
    // if (cancelSearch) {
    //     keyword = "";
    //     currentPage = 1;
    //     isEnd = false;
    // }
    // if (isEnd) {
    //     ElMessage({ message: "没有更多了", type: "success" });
    //     return new Promise<QuestionItem[]>((resolve) => {
    //         resolve([]);
    //     });
    // }
    // // console.log("getNextQuestions", sortType, currentPage);
    // return getQuestionsByPage(sortType, currentPage, keyword);
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
