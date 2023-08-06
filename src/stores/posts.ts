import { defineStore } from 'pinia'

export const usePostStore = defineStore({
    id: 'postStore',
    state: () => ({
        posts: [
            {
                title: 'My first post',
                content: 'This is my first post',
                photo: 'https://picsum.photos/200/300',
            },
        ],
    }),
})
