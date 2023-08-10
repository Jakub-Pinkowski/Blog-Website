import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                title: 'Blog-Website',
                description: 'Blog-Website',
            },
        },
        {
            path: '/post/:id',
            name: 'post',
            component: () => import('../views/PostView.vue'),
            props: true,
            meta: {
                title: 'Blog-Website',
                description: 'Blog-Website',
            },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
            meta: {
                title: 'About',
                description: 'About',
            },
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/AdminView.vue'),
            meta: {
                title: 'Admin',
                description: 'Admin',
            },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            redirect: '/',
        },
    ],
})

export default router
