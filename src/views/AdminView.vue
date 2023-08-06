<template>
    <div>
        <!-- When logged in -->
        <div v-if="authStore.user">
            <div class="add-posts">
                <div class="add-posts">
                    <form @submit.prevent="addNewPost">
                        <div class="form-group">
                            <label for="title">Title:</label>
                            <input
                                v-model="newPost.title"
                                type="text"
                                id="title"
                                placeholder="Enter post title"
                            />
                        </div>
                        <div class="form-group">
                            <label for="content">Content:</label>
                            <textarea
                                v-model="newPost.content"
                                id="content"
                                placeholder="Enter post content"
                            ></textarea>
                        </div>
                        <div class="form-group">
                            <div class="form-group">
                                <label>Drag and drop your photo here:</label>
                                <div
                                    class="drag-drop-area"
                                    :class="{
                                        'drag-over': isDragging,
                                        'upload-success': isUploaded,
                                    }"
                                    @drop.prevent="dropHandler"
                                    @dragover.prevent="dragOverHandler"
                                    @dragleave.prevent="dragLeaveHandler"
                                >
                                    <span v-if="isUploaded"
                                        >Uploaded successfully!</span
                                    >
                                    <span v-else>Drop your file here!</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit">Add Post</button>
                    </form>
                </div>
            </div>
            <div>
                <button @click="authStore.logout">Logout</button>
            </div>
        </div>
        <!-- When not logged in -->
        <div v-else>
            <form @submit.prevent="handleLogin">
                <input v-model="email" placeholder="Email" />
                <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
// FIXME: Websocket connection is not working

import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import Draggable from 'vuedraggable'

const postStore = usePostStore()
const authStore = useAuthStore()

// Authentication
onMounted(() => {
    authStore.initAuth()
})

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        await authStore.login(email.value, password.value)
        email.value = ''
        password.value = ''
    } catch (error) {
        alert('Failed to login: ' + error.message)
    }
}

// Upload image
const draggedFile = ref<File | null>(null)
const storage = getStorage()

const isDragging = ref(false)
const isUploaded = ref(false)

const dragOverHandler = () => {
    isDragging.value = true
}

const dragLeaveHandler = () => {
    isDragging.value = false
}

const dropHandler = (event) => {
    isDragging.value = false
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        draggedFile.value = event.dataTransfer.items[0].getAsFile()
        event.dataTransfer.clearData()
    }
}

const uploadImage = async () => {
    if (!draggedFile.value) return
    const filePath = `posts/${new Date().toISOString()}-${
        draggedFile.value.name
    }`
    const storageReference = storageRef(storage, filePath)

    const uploadTask = uploadBytesResumable(storageReference, draggedFile.value)

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
            },
            (error) => {
                console.error('Upload failed:', error)
                reject(error)
            },
            async () => {
                const imageUrl = await getDownloadURL(storageReference)
                resolve(imageUrl)
            }
        )
    })
}

// Add new post
const newPost = ref({
    title: '',
    content: '',
    image: '',
})

const addNewPost = async () => {
    if (draggedFile.value) {
        try {
            newPost.value.image = await uploadImage()
        } catch (error) {
            alert('Failed to upload image: ' + error.message)
            return
        }
    }

    if (newPost.value.title && newPost.value.content && newPost.value.image) {
        console.log(newPost.value)
        await postStore.addPost(newPost.value)
        isUploaded.value = true
        newPost.value = {
            title: '',
            content: '',
            image: '',
        }
        draggedFile.value = null // Clear the dragged file after successful post
    } else {
        alert('Please fill out all fields before submitting.')
    }
}
</script>

<style scoped lang="scss">
.drag-drop-area {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;

    // Hover effect
    &:hover {
        background: #f7f7f7;
        border-color: #aaa;
        transform: scale(1.05); // Slight scaling for emphasis
    }

    // Dragging over the drop zone
    &.drag-over {
        background: #f0f0f0;
        border-color: #666;
        transform: scale(1.1); // Further emphasis during drag
    }

    // On successful upload
    &.upload-success {
        border-color: #4caf50;
        background-color: #e8f5e9;
        color: #4caf50;
        font-weight: bold;
    }
}
</style>
