import { createRouter, createWebHistory } from 'vue-router'

// 导入视图组件
import NotFound from '../views/404.vue'
import StudentPhone from '../views/main-page.vue'
import TeacherList from '../views/teacher-list.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // 学生主页面
        {
            path: '/student',
            name: 'student',
            component: StudentPhone,
        },
        // 教师列表页面
        {
            path: '/teachers',
            name: 'TeacherList',
            component: TeacherList,
        },
        // 捕获所有未知路径
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
        },
    ],
});

export default router;
