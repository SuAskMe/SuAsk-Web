import type {
    GetQFMKeywordsReq,
    GetQFMKeywordsRes,
    GetQFMReq,
    GetQFMRes,
    PinQFMReq,
    PinQFMRes,
    SearchQFMReq,
} from "@/model/teacher-self.model";
import request from "@/utils/http/request";

// 新版统一收件箱接口（替代旧的 /teacher/question/* 系列）
enum Api {
    INBOX = "/questions/inbox",
    INBOX_KEYWORDS = "/questions/inbox/keywords",
    INBOX_SEARCH = "/questions/inbox/search",
    PIN = "/questions/pin",
}

export async function getQFMAllApi(req: GetQFMReq): Promise<GetQFMRes> {
    return await request
        .get(Api.INBOX, { params: { ...req, tag: "all" } })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function getQFMAnsweredApi(req: GetQFMReq): Promise<GetQFMRes> {
    return await request
        .get(Api.INBOX, { params: { ...req, tag: "answered" } })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function getQFMUnansweredApi(req: GetQFMReq): Promise<GetQFMRes> {
    return await request
        .get(Api.INBOX, { params: { ...req, tag: "unanswered" } })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function getQFMOnTopApi(): Promise<GetQFMRes> {
    return await request
        .get(Api.INBOX, { params: { page: 1, sort_type: 0, tag: "pinned" } })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function getQFMKeywordsApi(
    req: GetQFMKeywordsReq
): Promise<GetQFMKeywordsRes> {
    return await request
        .get(Api.INBOX_KEYWORDS, { params: { keyword: req.keyword } })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function searchQFMApi(req: SearchQFMReq): Promise<GetQFMRes> {
    return await request
        .get(Api.INBOX_SEARCH, { params: req })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function pinQFMApi(req: PinQFMReq): Promise<PinQFMRes> {
    return await request.post(Api.PIN, req).then((res) => {
        if (res) {
            return res.data;
        }
    });
}
