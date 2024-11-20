import type { AppRouteRecordRaw } from '../types'
import NotFound from '@/views/404-page.vue'

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
