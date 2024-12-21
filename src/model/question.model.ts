export interface QuestionBase {
    src_user_id: number | null;
    dst_user_id: number | null;
    title: string;
    content: string;
    is_private: boolean;
}

export interface Teacher {
    teacherId: number,
    teacherName: string
}