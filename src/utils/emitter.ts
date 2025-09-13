import mitt from 'mitt'

type Events = {
    questionDetailOpened: { questionId: number }
    // 可以在这里添加其他事件类型
}

export const emitter = mitt<Events>()