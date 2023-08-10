<template>
    <section class="view_container">
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
                        <h4>{{ post.date }}</h4>
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
                        <h4>{{ post.date }}</h4>
                        <h2>{{ post.title }}</h2>
                        <span class="read_more">Read More</span>
                    </div>
                </router-link>
            </div>
        </div>
    </section>
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
.view_container {
    .title {
        margin: 1rem 2rem;
    }
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
            }

            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 70%;
                margin: 1rem;

                h4 {
                    margin: 0.7rem 0;
                }

                h2 {
                    margin: 0.7rem 0;
                }

                .read_more {
                    margin: 0.7rem 0;
                    font-weight: 400;
                    text-decoration: underline;
                    line-height: 1.5;
                }
            }
        }
    }
}

/* Mobile */

@media screen and (max-width: 768px) {
    .view_container {
        margin-top: 1rem;

        .title {
            margin-top: 2rem;
            margin-bottom: 0;
        }
        .post_columns {
            flex-direction: column;
            gap: 0;
            margin: 3rem 0;

            .post {
                padding: 0 !important;

                img:hover {
                    opacity: 1 !important;
                    transform: scale(1) !important;
                }

                .text {
                    h4 {
                        margin: 0.5rem 0;
                    }

                    h2 {
                        margin: 0.5rem 0;
                    }
                    .read_more {
                        margin-bottom: 0.7rem;
                    }
                }
            }
        }
    }
}
</style>
