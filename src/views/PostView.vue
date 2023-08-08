<template>
    <div class="post-detail" v-if="post">
        <img :src="post.image" alt="Post Image" />
        <h1>{{ post.title }}</h1>
        <div v-html="post.content"></div>
    </div>
    <div v-else>Post not found.</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/stores/posts'

const route = useRoute()
const postId = ref(route.params.id)

const postStore = usePostStore()
const post = computed(() =>
    postStore.posts.find((post) => post.id === postId.value)
)
</script>
