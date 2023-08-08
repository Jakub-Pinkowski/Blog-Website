<template>
    <div>
        <div class="post-detail" v-if="postFetched && post">
            <h3>
                {{ post.date }}<span class="dot"> &bull;</span> Written by
                {{ author }}
            </h3>
            <h1>{{ post.title }}</h1>
            <img :src="post.image" alt="Post Image" />
            <div v-html="post.content" class="content"></div>
            <h3>
                {{ author }}
            </h3>
            <div class="links">
                <router-link to="'/'">Back to Blog</router-link>
                <a v-if="nextPost" :href="'/post/' + nextPost.id">
                    {{ nextPost.title }}
                </a>
            </div>
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

const author = 'Iuliia Matiash'

const postStore = usePostStore()
const postFetched = ref(false)

const post = computed(() =>
    postStore.posts.find((post) => post.id === postId.value)
)

// FIXME: Fix the Websocket issue when navigating to the next post
const nextPost = computed(() => {
    if (!post || !postFetched) {
        return null
    }

    const currentPostIndex = postStore.posts.findIndex(
        (post) => post.id === postId.value
    )
    if (
        currentPostIndex === -1 ||
        currentPostIndex === postStore.posts.length - 1
    ) {
        return null
    }
    return postStore.posts[currentPostIndex + 1]
})

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
    margin-top: 4rem;

    img {
        width: 100%;
        max-width: 800px;
        margin-bottom: 2rem;
    }

    .content {
        width: 100%;
        max-width: 800px;
        margin-bottom: 2rem;
    }

    .links {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 1rem;

        a {
            color: var(--dark-gray);
            font-size: 1.5rem;
            font-weight: 400;
            text-decoration: none;
            margin: 1rem 2rem;
        }
    }
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
