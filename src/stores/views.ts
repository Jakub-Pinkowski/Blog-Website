import { defineStore } from 'pinia'

export const useViewStore = defineStore({
    id: 'viewStore',
    state: () => ({
        views: [
            {
                name: 'Home',
                route: '/',
            },
            {
                name: 'About',
                route: '/about',
            },
        ],
    }),
})
