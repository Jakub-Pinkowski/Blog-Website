import { defineStore } from 'pinia'

import view_photos from '@/assets/views/view_photos.jpg'
import view_about from '@/assets/views/view_about.jpg'

export const useViewStore = defineStore({
    id: 'viewStore',
    state: () => ({
        views: [
            {
                name: 'Photos',
                route: '/photos',
                image: view_photos,
                description: 'Checkout my photos',
            },
            {
                name: 'About',
                route: '/about',
                image: view_about,
                description: 'Read more about me',
            },
        ],
    }),
})
