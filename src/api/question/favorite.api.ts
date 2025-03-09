import type {
    FavoriteReq,
    FavoriteRes,
    GetFavoriteByKeywordReq,
    GetFavoriteByKeywordRes,
    GetFavoriteReq,
    GetFavoriteRes,
    SearchFavoriteReq,
    SearchFavoriteRes,
} from '@/model/favorite.model'
import request from '@/utils/http/request'

enum Api {
    FAVORITE = '/favorites',
    GET_FAVORITE_BY_KEYWORD = '/favorites/keywords',
    SEARCH_FAVORITE = '/favorites/search',
}

export async function getFavoriteApi(req: GetFavoriteReq): Promise<GetFavoriteRes> {
    return request.get(Api.FAVORITE, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function getFavoriteByKeywordApi(
    req: GetFavoriteByKeywordReq,
): Promise<GetFavoriteByKeywordRes> {
    return request.get(Api.GET_FAVORITE_BY_KEYWORD, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function searchFavoriteApi(req: SearchFavoriteReq): Promise<SearchFavoriteRes> {
    return request.get(Api.SEARCH_FAVORITE, { params: req }).then((res) => {
        if (res) {
            return res.data
        }
    })
}

export async function favoriteApi(req: FavoriteReq): Promise<FavoriteRes> {
    return request.post(Api.FAVORITE, req).then((res) => {
        if (res) {
            return res.data
        }
    })
}
