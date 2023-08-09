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
                {{ author }} <span class="dot"> &bull;</span>
                {{ post.date }}
            </h3>
            <div class="links">
                <router-link to="'/'">
                    <span class="arrow-icon" v-html="leftArrowIcon" />Back to
                    Blog</router-link
                >
                <a v-if="nextPost" :href="'/post/' + nextPost.id">
                    {{ nextPost.title }}
                    <span class="arrow-icon" v-html="rightArrowIcon" />
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

const leftArrowIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
</svg>
`

const rightArrowIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
</svg>
`

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
        justify-content: space-between;
        align-items: center;
        margin: 1rem;
        width: 100%;
        max-width: 800px;

        a {
            display: block;
            color: var(--dark-gray);
            font-size: 1.5rem;
            font-weight: 400;
            text-decoration: none;
            margin: 1rem 2rem;
            transition: all 0.3s ease-out;
        }

        a:hover {
            color: var(--accent-color);
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

.arrow-icon {
    width: 20px;
    height: 20px;
    fill: var(--dark-gray);
    margin: 0 0.5rem;
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
