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

enum Api {
    GET_QFM_ALL = "/teacher/question/all",
    GET_QFM_ANSWERED = "/teacher/question/answered",
    GET_QFM_UNANSWERED = "/teacher/question/unanswered",
    GET_QFM_ONTOP = "/teacher/question/top",
    GET_QFM_KEYWORDS = "/teacher/question/keywords",
    SEARCH_QFM = "/teacher/question/search",
    PIN_QFM = "/teacher/question/pin",
}

export async function getQFMAllApi(req: GetQFMReq): Promise<GetQFMRes> {
    return await request.get(Api.GET_QFM_ALL, { params: req }).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function getQFMAnsweredApi(req: GetQFMReq): Promise<GetQFMRes> {
    return await request
        .get(Api.GET_QFM_ANSWERED, { params: req })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function getQFMUnansweredApi(req: GetQFMReq): Promise<GetQFMRes> {
    return await request
        .get(Api.GET_QFM_UNANSWERED, { params: req })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function getQFMOnTopApi(): Promise<GetQFMRes> {
    return await request.get(Api.GET_QFM_ONTOP).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function getQFMKeywordsApi(
    req: GetQFMKeywordsReq
): Promise<GetQFMKeywordsRes> {
    return await request
        .get(Api.GET_QFM_KEYWORDS, { params: req })
        .then((res) => {
            if (res) {
                return res.data;
            }
        });
}

export async function searchQFMApi(req: SearchQFMReq): Promise<GetQFMRes> {
    return await request.get(Api.SEARCH_QFM, { params: req }).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

export async function pinQFMApi(req: PinQFMReq): Promise<PinQFMRes> {
    return await request.post(Api.PIN_QFM, req).then((res) => {
        if (res) {
            return res.data;
        }
    });
}
