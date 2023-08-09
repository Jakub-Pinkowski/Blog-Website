<template>
    <div class="view">
        <h1>Blog</h1>
        <div class="post_gallery">
            <router-link
                v-for="(post, index) in posts"
                :key="post.id"
                :to="'/post/' + post.id"
                :style="{ gridColumn: index % 2 === 0 ? '1' : '2' }"
            >
                <div class="post">
                    <img :src="post.image" alt="" />
                    <div class="text">
                        <h3>{{ post.date }}</h3>
                        <h2>{{ post.title }}</h2>
                        <span class="read_more">Read More</span>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
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

<style scoped lang="scss">
.post_gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 2rem;

    a {
        text-decoration: none;
        color: inherit;
    }

    .post {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;

        img {
            width: 70%;
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

/* Modal */
.photo_modal {
    display: flex;
    position: fixed;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    align-items: center;
    overflow: hidden;
    justify-content: center;

    .modal-background {
        position: fixed;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
        background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-content {
        max-width: 1200px;
        max-height: 900px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: auto;
            height: 900px;
            object-fit: contain;
            max-width: 100%;
        }
    }
}

/* Modal Transition */

.modal-enter-active {
    transition: opacity 0.3s ease-out;
}

.modal-leave-active {
    transition: opacity 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Mobile */

@media screen and (max-width: 768px) {
    img:hover {
        opacity: 1 !important;
        transform: scale(1) !important;
    }
}
</style>
