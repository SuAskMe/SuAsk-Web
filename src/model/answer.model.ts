// 获取问题回答

export interface Question {
    id: number;
    title: string;
    contents: string;
    views: number;
    created_at: number;
    image_urls: string[];
}

export interface Answer {
    id: number;
    user_id: number;
    user_avatar: string;
    contents: string;
    created_at: number;
    upvotes: number;
    image_urls: string[];
    is_upvoted: boolean;
    teacher_name: string;
    nickname: string;
}

export interface QuestionDetailRes {
    question: Question;
    answer_list: Answer[];
    can_reply: boolean;
}

// 添加一个回答

export interface AddAnswer {
    question_id: number;
    content: string;
    // files 这里需要formData拼装
}

// 点赞一个回答
export interface UpvoteAnswerReq {
    question_id: number;
    answer_id: number;
}

export interface UpvoteAnswerRes {
    upvote_num: number;
    is_upvoted: boolean;
}