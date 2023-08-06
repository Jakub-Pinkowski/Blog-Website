<template>
    <main>
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
</script>
