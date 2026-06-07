import type { AppRouteRecordRaw } from '../types'
import NotFound from '@/pages/not-found'

export const PageNotFound: AppRouteRecordRaw = {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
    },
}
