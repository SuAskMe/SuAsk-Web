import {
    deleteNotificationApi,
    getNotificationApi,
    getNotificationCountApi,
    type NewAnswer,
    type NewQuestion,
    type NewReply,
} from '@/entities/notification'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const NOTIFICATION_TTL = 30_000
const COUNT_TTL = 15_000

export const NotificationStore = defineStore('notification', () => {
    const newQuestion = ref<NewQuestion[]>([])
    const newAnswer = ref<NewAnswer[]>([])
    const newReply = ref<NewReply[]>([])
    const newQuestionCount = ref(0)
    const newAnswerCount = ref(0)
    const newReplyCount = ref(0)
    const notificationLoadedAt = ref(0)
    const countLoadedAt = ref(0)

    const unreadCount = computed(
        () => newQuestionCount.value + newAnswerCount.value + newReplyCount.value,
    )

    async function loadCount(userId: number, force = false) {
        if (!userId) return
        const now = Date.now()
        if (!force && now - countLoadedAt.value < COUNT_TTL) return
        const res = await getNotificationCountApi(userId)
        if (!res) return
        newQuestionCount.value = res.new_question_count
        newAnswerCount.value = res.new_answer_count
        newReplyCount.value = res.new_reply_count
        countLoadedAt.value = now
    }

    async function loadNotifications(userId: number, force = false) {
        if (!userId) return
        const now = Date.now()
        if (!force && now - notificationLoadedAt.value < NOTIFICATION_TTL) return
        const res = await getNotificationApi(userId)
        if (!res) return
        newQuestion.value = res.new_question
        newAnswer.value = res.new_answer
        newReply.value = res.new_reply
        notificationLoadedAt.value = now
    }

    function markQuestionRead(questionId: number) {
        newQuestion.value = newQuestion.value.map((item) =>
            item.question_id === questionId ? { ...item, is_read: true } : item,
        )
        newAnswer.value = newAnswer.value.map((item) =>
            item.question_id === questionId ? { ...item, is_read: true } : item,
        )
        newReply.value = newReply.value.map((item) =>
            item.question_id === questionId ? { ...item, is_read: true } : item,
        )
        countLoadedAt.value = 0
    }

    async function deleteNotification(id: number, type: string) {
        await deleteNotificationApi(id)
        if (type === 'question') {
            newQuestion.value = newQuestion.value.filter((item) => item.id !== id)
        } else if (type === 'answer') {
            newAnswer.value = newAnswer.value.filter((item) => item.id !== id)
        } else if (type === 'reply') {
            newReply.value = newReply.value.filter((item) => item.id !== id)
        }
        countLoadedAt.value = 0
    }

    function clear() {
        newQuestion.value = []
        newAnswer.value = []
        newReply.value = []
        newQuestionCount.value = 0
        newAnswerCount.value = 0
        newReplyCount.value = 0
        notificationLoadedAt.value = 0
        countLoadedAt.value = 0
    }

    return {
        newQuestion,
        newAnswer,
        newReply,
        newQuestionCount,
        newAnswerCount,
        newReplyCount,
        unreadCount,
        loadCount,
        loadNotifications,
        markQuestionRead,
        deleteNotification,
        clear,
    }
})
