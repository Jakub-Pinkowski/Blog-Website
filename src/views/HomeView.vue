<template>
    <main>
        <div class="post_gallery">
            <div class="post" v-for="post in posts" :key="post.id">
                <img :src="post.details.image" alt="" />
                <div class="text">
                    <h1>{{ post.details.title }}</h1>
                    <p>{{ post.details.content }}</p>
                </div>
            </div>
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

<style scoped lang="scss">
.post_gallery {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 1rem;

    .post {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 100vh;
        margin: 1rem 0;
        padding: 1rem;

        img {
            width: 30%;
            height: auto;
            object-fit: cover;
            border-radius: 5px;
        }

        .text {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            width: 70%;
            margin-left: 1rem;
        }
    }
}
</style>
