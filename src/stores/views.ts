import { defineStore } from 'pinia'

export const useViewStore = defineStore({
    id: 'viewStore',
    state: () => ({
        views: [
            {
                name: 'About',
                route: '/about',
                description: 'Read more about me',
            },
        ],
    }),
})
