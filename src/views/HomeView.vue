<template>
    <main>
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
        <div v-for="post in posts" :key="post.id">
            <h1>{{ post.details.title }}</h1>
            <p>{{ post.details.content }}</p>
            <img :src="post.details.image" alt="" />
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/posts'

const postStore = usePostStore()

onMounted(async () => {
    await postStore.fetchPosts()
})
const posts = computed(() => postStore.posts)

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
