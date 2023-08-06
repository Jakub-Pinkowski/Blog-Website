import { defineStore } from 'pinia'
import { database } from '@/assets/firebase'
import { ref as dbRef, get, push, set } from 'firebase/database'

interface Post {
    id: string
    details: {
        title: string
        content: string
        image: string
    }
}

export const usePostStore = defineStore({
    id: 'postStore',
    state: (): { posts: Post[] } => ({
        posts: [],
    }),
    actions: {
        async fetchPosts() {
            const postsRef = dbRef(database, 'posts')
            try {
                const snapshot = await get(postsRef)
                if (snapshot.exists()) {
                    const rawData = snapshot.val()
                    this.posts = Object.keys(rawData).map((key) => {
                        return {
                            id: key,
                            details: {
                                title: rawData[key].title,
                                content: rawData[key].content,
                                image: rawData[key].image,
                            },
                        }
                    })
                } else {
                    this.posts = []
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
            }
        },
        async addPost(post: Omit<Post, 'id'>) {
            const postsRef = dbRef(database, 'posts')
            try {
                const newPostRef = push(postsRef)
                await set(newPostRef, post.details)
                this.fetchPosts()
            } catch (error) {
                console.error('Error adding post:', error)
            }
        },
    },
})
