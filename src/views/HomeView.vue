<template>
    <div class="view">
        <h1 class="title">Blog</h1>
        <div class="post_columns">
            <div class="column">
                <router-link
                    v-for="post in evenPosts"
                    :key="post.id"
                    :to="'/post/' + post.id"
                    class="post"
                >
                    <img :src="post.image" alt="" />
                    <div class="text">
                        <h3>{{ post.date }}</h3>
                        <h2>{{ post.title }}</h2>
                        <span class="read_more">Read More</span>
                    </div>
                </router-link>
            </div>
            <div class="column">
                <router-link
                    v-for="post in oddPosts"
                    :key="post.id"
                    :to="'/post/' + post.id"
                    class="post"
                >
                    <img :src="post.image" alt="" />
                    <div class="text">
                        <h3>{{ post.date }}</h3>
                        <h2>{{ post.title }}</h2>
                        <span class="read_more">Read More</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/posts'

const postStore = usePostStore()

onMounted(async () => {
    await postStore.fetchPosts()
})
const posts = computed(() => postStore.posts)

const evenPosts = computed(() =>
    posts.value.filter((_, index) => index % 2 === 0)
)
const oddPosts = computed(() =>
    posts.value.filter((_, index) => index % 2 !== 0)
)
</script>

<style scoped lang="scss">
.post_columns {
    display: flex;
    gap: 1rem;
    margin: 2rem;

    .column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .post {
        text-decoration: none;
        color: inherit;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 90%;
            height: auto;
            object-fit: cover;
            border-radius: 5px;
            transition: all 0.5s ease-out;
        }

        img:hover {
            opacity: 0.95;
            transform: scale(1.05);
            cursor: pointer;
        }

        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 70%;
            margin: 1rem;

            h3 {
                margin-top: 1.5rem;
            }

            .read_more {
                color: var(--dark-gray);
                font-size: 1rem;
                font-weight: 500;
                text-decoration: underline;
                line-height: 1.5;
                transition: all 0.3s ease-out;
                margin-bottom: 3rem;
            }
        }
    }
}

/* Mobile */

@media screen and (max-width: 768px) {
    img:hover {
        opacity: 1 !important;
        transform: scale(1) !important;
    }

    .title {
        margin: 1rem 2rem;
    }

    .view {
        margin: 0;
    }

    .post {
        padding: 0 !important;
    }

    .post_columns {
        flex-direction: column;
        gap: 0;
        margin: 2rem 0;

        .read_more {
            margin-bottom: 1rem !important;
        }
    }
}
</style>
