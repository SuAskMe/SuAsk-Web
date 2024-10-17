import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Main.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      title: '404 NotFound',
      component: ()=> import('../views/404.vue')
  }
  ]
})

export default router
