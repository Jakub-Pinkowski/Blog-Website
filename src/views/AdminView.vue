<template>
    <div>
        <!-- When logged in -->
        <div v-if="authStore.user">
            <AddPostForm />
        </div>
        <!-- When not logged in -->
        <div v-else>
            <form @submit.prevent="handleLogin">
                <input v-model="email" placeholder="Email" />
                <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
// FIXME: Websocket connection is not working

import AddPostForm from '@/components/AddPostForm.vue'
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import Draggable from 'vuedraggable'

const postStore = usePostStore()
const authStore = useAuthStore()

// Authentication
onMounted(() => {
    authStore.initAuth()
})

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        await authStore.login(email.value, password.value)
        email.value = ''
        password.value = ''
    } catch (error) {
        alert('Failed to login: ' + error.message)
    }
}
</script>

<style scoped lang="scss"></style>
