<template>
    <main>
        <div class="post_gallery">
            <div class="post" v-for="post in posts" :key="post.id">
                <img
                    :src="post.details.image"
                    alt=""
                    @click="openModal(post.details.image)"
                />
                <div class="text">
                    <h1>{{ post.details.title }}</h1>
                    <div v-html="post.details.content"></div>
                </div>
            </div>
        </div>

        <!-- Modal-->
        <transition name="modal" mode="out-in" appear>
            <div class="photo_modal" v-if="modalOpen">
                <div class="modal-background" @click="closeModal"></div>
                <div class="modal-content" @click="closeModal">
                    <img :src="modalImage" alt="Full Size Image" />
                </div>
            </div>
        </transition>
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

// Modal functionality
let modalOpen = ref(false)
let modalImage = ref('')

const openModal = (imageSrc: string) => {
    modalImage.value = imageSrc
    modalOpen.value = true
}

const closeModal = () => {
    modalOpen.value = false
}
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
            justify-content: flex-start;
            align-items: flex-start;
            width: 70%;
            margin-left: 1rem;
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
