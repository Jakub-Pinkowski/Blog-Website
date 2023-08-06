import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

const auth = getAuth()

export const useAuthStore = defineStore({
    id: 'authStore',
    state: () => ({
        user: null as User | null,
    }),
    actions: {
        initAuth() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user
                } else {
                    this.user = null
                }
            })
        },
    },
})
