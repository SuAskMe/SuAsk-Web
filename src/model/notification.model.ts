export interface Notification {
    new_question: NewQuestion[];
    new_answer: NewAnswer[];
    new_reply: NewReply[];
}

export interface NotificationBase {
    id: number;
    question_id: number;
    question_title: string;
    question_content: string;
    is_read: boolean;
    created_at: number;
}

export interface NewQuestion extends NotificationBase {
    user_avatar: string;
    user_name: string;
    user_id: number;
}

export interface NewAnswer extends NotificationBase {
    answer_id: number;
    answer_content: string;
    respondent_avatar: string;
    respondent_name: string;
    respondent_id: number;
}

export interface NewReply extends NotificationBase {
    answer_id: number;
    answer_content: string;
    respondent_avatar: string;
    respondent_name: string;
    respondent_id: number;
    reply_id: number;
    reply_content: string;
}

export interface UpdateNotificationRes {
    id: number;
    is_read: boolean;
}

export interface NotificationCountRes {
    new_question_count: number;
    new_reply_count: number;
    new_answer_count: number;
}