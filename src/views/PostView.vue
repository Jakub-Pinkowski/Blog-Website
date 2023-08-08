<template>
    <div>
        <div class="post-detail" v-if="postFetched && post">
            <img :src="post.image" alt="Post Image" />
            <h1>{{ post.title }}</h1>
            <div v-html="post.content"></div>
        </div>
        <div v-else class="loading-message">
            <div class="loading-spinner"></div>
            Loading...
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/stores/posts'

const route = useRoute()
const postId = ref(route.params.id)

const postStore = usePostStore()
const postFetched = ref(false)

const post = computed(() =>
    postStore.posts.find((post) => post.id === postId.value)
)

// Fetch post data when component is mounted
onMounted(async () => {
    await postStore.fetchPosts()
    postFetched.value = true
})
</script>

<style scoped lang="scss">
.post-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5rem;
}

.loading-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 1.2rem;
    color: var(--dark-gray);
}

.loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--accent-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
