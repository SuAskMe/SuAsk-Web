export const ADMIN_QUESTIONS_PATH = '/admin/questions'

export const ADMIN_QUESTIONS_ROUTE_NAME = 'AdminQuestionsRoot'
export const ADMIN_QUESTIONS_CHILD_ROUTE_NAME = 'AdminQuestions'
export const ADMIN_QUESTION_DETAIL_ROUTE_NAME = 'AdminQuestionDetail'

export function getAdminQuestionDetailPath(id: number): string {
    return `${ADMIN_QUESTIONS_PATH}/${id}`
}
