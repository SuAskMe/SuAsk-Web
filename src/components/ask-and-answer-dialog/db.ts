import Dexie, { type EntityTable } from 'dexie';

interface Question {
    id: number;      // 主键，自增
    title: string;   // 标题
    content: string; // 内容
    imgList: Blob[]; // 图片列表
    time: Date       // 保存草稿的时间
}

// interface FileData {
//     blob: Blob;
//     name: string;
//     type: string;
//     lastModified: number;
// }

interface Answer {
    id: number;      // 主键，自增
    question_id: number; // 问题id
    in_reply_to?: number; // 回复的评论id
    content: string; // 内容
    imgList: Blob[]; // 图片列表
    time: Date       // 保存草稿的时间
}

const db = new Dexie('DraftsDatabase') as Dexie & {
    questions: EntityTable<
        Question,
        'id'
    >;
    answers: EntityTable<
        Answer,
        'id'
    >;
};

// Schema declaration:
db.version(1).stores({
    questions: '++id, title, content, ImgList, time',
    answers: '++id, question_id, content, ImgList, time'
});

export type { Question, Answer };
export { db };