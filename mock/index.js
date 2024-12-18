import Mock from "mockjs";

const Random = Mock.Random;

const mockQuestion = () => {
    const data = Mock.mock({
        id: Random.integer(1, 1000000),
        title: Random.ctitle(5, 10),
        contents: Random.cparagraph(1, 3),
        views: Random.integer(100, 10000),
        created_at: new Date(Random.datetime()).getTime(),
        image_urls: [Random.image("200x100", Random.color(), Random.word(5))],
        is_favorited: Random.boolean(),
        answer_num: Random.integer(2, 10),
        answer_avatars: [
            Random.image("120x120", Random.color(), Random.word(5)),
            Random.image("120x120", Random.color(), Random.word(5)),
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

export default mockQuestions;
