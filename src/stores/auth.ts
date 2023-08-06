import { defineStore } from 'pinia'
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import firebase from 'firebase/compat/app' // Import this for the types

const auth = getAuth()

export const useAuthStore = defineStore({
    id: 'authStore',
    state: () => ({
        user: null as firebase.User | null, // Use this type for user
        error: null as string | null,
    }),
    actions: {
        // Initialize auth state listener
        initAuth() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user
                } else {
                    this.user = null
                }
            })
        },

        // Sign in with email and password
        async login(email: string, password: string) {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                this.user = userCredential.user
            } catch (error) {
                this.error = error.message
            }
        },

        // Log out
        async logout() {
            try {
                await auth.signOut()
                this.user = null
            } catch (error) {
                this.error = error.message
            }
        },
    },
})
