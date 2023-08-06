<template>
    <div class="admin_panel">
        <div class="add_posts">
            <div class="add_posts">
                <form @submit.prevent="addNewPost">
                    <div class="form-group">
                        <input
                            v-model="newPost.title"
                            type="text"
                            id="title"
                            placeholder="Title"
                        />
                    </div>
                    <div class="form-group">
                        <textarea
                            v-model="newPost.content"
                            id="content"
                            cols="150"
                            rows="15"
                            placeholder="Content"
                        ></textarea>
                    </div>
                    <div class="form-group">
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
                            <span v-else>Drop an image here</span>
                        </div>
                    </div>
                    <button class="btn btn-sm" type="submit">Add Post</button>
                </form>
            </div>
            <div>
                <button class="btn btn-sm logout" @click="authStore.logout">
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

// Drag and drop styling
const isDragging = ref(false)
const isUploaded = ref(false)

const dragOverHandler = () => {
    isDragging.value = true
}

const dragLeaveHandler = () => {
    isDragging.value = false
}

// Upload image
const draggedFile = ref<File | null>(null)
const storage = getStorage()

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
.admin_panel {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;

    form {
        display: flex;
        flex-direction: column;

        input {
            width: 50%;
        }

        input,
        textarea {
            margin: 1rem 0;
            padding: 0.5em;
            border: 1px solid var(--dark-accent);
            border-radius: 5px;
        }

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
    }
}

button {
    margin: 1rem 0;
    width: 90px;
    border: 1px solid var(--dark-accent);
    color: var(--main-bg-color);
    transition: background-color 0.5s ease;
}

button:hover {
    border: 1px solid var(--dark-accent);
    background-color: var(--light-accent);
}

.logout {
    margin-top: 4rem;
    transition: background-color 0.5s ease;
}

.logout:hover {
    background-color: var(--accent-color);
    color: var(--light-gray);
}
</style>
