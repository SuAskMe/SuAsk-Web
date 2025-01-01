import { favoriteApi } from "@/api/question/favorite.api";
import { ElMessage } from "element-plus";

let skipLock = false;

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.animate(
                    [{ background: "#80808050" }, { background: "#80808000" }],
                    { duration: 1500, easing: "ease-in-out", iterations: 1 }
                );
            }
        });
    },
    { threshold: 1.0 }
);

export const scrollToQuote = (key: {
    id: number;
    quoteId: number;
    userId: number;
}) => {
    const el = document.getElementById(`answer-${key.quoteId}`);
    if (el && !skipLock) {
        skipLock = true;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        observer.observe(el);
        setTimeout(() => {
            observer.unobserve(el);
            skipLock = false;
        }, 2000);
    }
};

let idSeed = 0;
export const GenId = (): number => {
    idSeed += 1;
    return idSeed;
};

export interface AnswerItem {
    id: number;
    userId: number;
    isMine?: boolean;
    avatar: string;
    nickName: string;
    content: string;
    upvotesCount: number;
    createdAt: number;
    isLiked: boolean;
    quote: {
        id: number;
        text: string;
        author: string;
    };
    isTeacher?: boolean;
    teacherName?: string;
    imageUrls: string[];
}

export async function Favorite(question_id: number): Promise<boolean | null> {
    var res = await favoriteApi({ question_id });
    if (res) {
        return res.is_favorite;
    }
    ElMessage.error("请求失败");
    return null;
}
