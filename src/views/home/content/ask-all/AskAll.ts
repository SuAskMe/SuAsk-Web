import { ElMessage } from "element-plus";

export interface QuestionItem {
    id: number;
    title: string;
    text: string;
    views: number;
    created_at: number;
    image_urls: string[];
    is_favourite: boolean;
    answer_num: number;
    answer_avatars: string[];
}

let isEnd = false;
let currentPage = 0;
let sortType = 0;

export async function getNextQuestions(
    sortType_?: number
): Promise<QuestionItem[]> {
    if (isEnd) {
        ElMessage({ message: "没有更多了", type: "success" });
        return new Promise<QuestionItem[]>((resolve) => {
            resolve([]);
        });
    }
    if (sortType_ !== undefined && sortType_ !== sortType) {
        currentPage = 0;
        sortType = sortType_;
    } else {
        currentPage++;
    }
    return getQuestionsByPage(sortType, currentPage);
}

async function getQuestionsByPage(
    sortType: number,
    page: number
): Promise<QuestionItem[]> {
    const list: QuestionItem[] = await new Promise((resolve) => {
        if (currentPage === 3) {
            isEnd = true;
        }
        setTimeout(() => {
            resolve(questions);
        }, 1000);
    });
    return list;
}

const imagesUrls: string[] = [
    "/src/assets/bg_imgs/1.png",
    "/src/assets/bg_imgs/2.png",
    "/src/assets/bg_imgs/3.png",
    "/src/assets/bg_imgs/4.png",
];

const questions: QuestionItem[] = [
    {
        id: 1,
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        created_at: new Date().getTime(),
        image_urls: imagesUrls,
        is_favourite: false,
        answer_num: 0,
        answer_avatars: [],
    },
    {
        id: 2,
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        created_at: new Date().getTime(),
        image_urls: imagesUrls,
        is_favourite: false,
        answer_num: 1,
        answer_avatars: ["src/assets/default_avatar.png"],
    },
    {
        id: 1,
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        created_at: new Date().getTime(),
        image_urls: imagesUrls,
        is_favourite: false,
        answer_num: 0,
        answer_avatars: [],
    },
    {
        id: 2,
        title: "测试页面",
        text: "测试页面的文本内容测试页",
        views: 1000,
        created_at: new Date().getTime(),
        image_urls: imagesUrls,
        is_favourite: false,
        answer_num: 1,
        answer_avatars: ["src/assets/default_avatar.png"],
    },
];
