import type { GetHistoryByKeywordReq, GetHistoryByKeywordRes, GetHistoryReq, GetHistoryRes, SearchHistoryReq, SearchHistoryRes } from "@/model/history.model";
import request from "@/utils/http/request";

enum Api {
    GET_HISTORY = '/history',
    GET_HISTORY_BY_KEYWORD = '/history/keywords',
    SEARCH_HISTORY = '/history/search',
}

export async function getHistoryApi(req: GetHistoryReq): Promise<GetHistoryRes> {
    return request.get(Api.GET_HISTORY, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function getHistoryByKeywordApi(req: GetHistoryByKeywordReq): Promise<GetHistoryByKeywordRes> {
    return request.get(Api.GET_HISTORY_BY_KEYWORD, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function searchHistoryApi(req: SearchHistoryReq): Promise<SearchHistoryRes> {
    return request.get(Api.SEARCH_HISTORY, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}
