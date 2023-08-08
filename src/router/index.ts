import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/post/:id',
            name: 'post',
            component: () => import('../views/PostView.vue'),
            props: true,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/AdminView.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            redirect: '/',
        },
    ],
})

export default router
