export const pullInfo = (questionId: number) => {
    console.log(questionId);
    return {
        title: "Ask All Detail",
        text: "This is the content of Ask All Detail page.",
        views: 123,
        timeStamp: new Date().getTime(),
    };
};

// :title="'Ask All Detail'"
// :text="'This is the content of Ask All Detail page.'"
// :views="123"
// :time-stamp="new Date().getTime()"
