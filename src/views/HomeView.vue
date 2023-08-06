<template>
    <main>
        <div v-for="post in posts">
            <h1>{{ post.title }}</h1>
            <p>{{ post.content }}</p>
            <img :src="post.photo" alt="" />
        </div>
    </main>
</template>

<script setup lang="ts">
import { usePostStore } from '@/stores/posts'

const postStore = usePostStore()
const posts = postStore.posts
</script>
