import { defineStore } from 'pinia'
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'

const auth = getAuth()

export const useAuthStore = defineStore({
    id: 'authStore',
    state: () => ({
        user: null as FirebaseUser | null,
        error: null as string | null,
    }),
    actions: {
        initAuth() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user as FirebaseUser
                } else {
                    this.user = null
                }
            })
        },

        async login(email: string, password: string) {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                this.user = userCredential.user as FirebaseUser
            } catch (error) {
                this.error = (error as { message: string }).message
            }
        },

        async logout() {
            try {
                await auth.signOut()
                this.user = null
            } catch (error) {
                this.error = (error as { message: string }).message
            }
        },
    },
})
