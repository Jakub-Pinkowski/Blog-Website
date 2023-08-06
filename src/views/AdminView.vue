<template>
    <div v-if="authStore.user">
        <div class="add-posts">
            <div class="add-posts">
                <form @submit.prevent="addNewPost">
                    <div class="form-group">
                        <label for="title">Title:</label>
                        <input
                            v-model="newPost.title"
                            type="text"
                            id="title"
                            placeholder="Enter post title"
                        />
                    </div>
                    <div class="form-group">
                        <label for="content">Content:</label>
                        <textarea
                            v-model="newPost.content"
                            id="content"
                            placeholder="Enter post content"
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label for="photo">Photo URL:</label>
                        <input
                            v-model="newPost.image"
                            type="text"
                            id="photo"
                            placeholder="Enter photo URL"
                        />
                    </div>
                    <button type="submit">Add Post</button>
                </form>
            </div>
        </div>
    </div>
    <div v-else>
        <form @submit.prevent="handleLogin">
            <input v-model="email" placeholder="Email" />
            <input type="password" v-model="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'

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

// Add new post
const newPost = ref({
    title: '',
    content: '',
    image: '',
})

const addNewPost = async () => {
    if (newPost.value.title && newPost.value.content && newPost.value.image) {
        console.log(newPost.value)
        await postStore.addPost(newPost.value)
        newPost.value = {
            title: '',
            content: '',
            image: '',
        }
    } else {
        alert('Please fill out all fields before submitting.')
    }
}
</script>

<style scoped></style>
