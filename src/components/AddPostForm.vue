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
                            required
                        />
                    </div>
                    <div class="form-group quill-editor-container">
                        <QuillEditor
                            class="ql_editor"
                            theme="snow"
                            :options="editorOptions"
                            v-model="newPost.content"
                            @text-change="updateContent"
                        />
                    </div>
                    <div class="form-group">
                        <div
                            class="drag-drop-area"
                            :class="{
                                'drag-over': isDragging,
                                'upload-success': imageUrl || isProcessing,
                            }"
                            @drop.prevent="dropHandler"
                            @dragover.prevent="dragOverHandler"
                            @dragenter.prevent="dragEnterHandler"
                            @dragleave.prevent="dragLeaveHandler"
                        >
                            <span v-if="imageUrl">{{ draggedFile.name }}</span>
                            <span v-else-if="isProcessing"
                                >Image is processing...</span
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
import { ref, computed } from 'vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import Draggable from 'vuedraggable'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const postStore = usePostStore()
const authStore = useAuthStore()

const isFormValid = computed(() => {
    return (
        newPost.value.title.trim() !== '' && newPost.value.content.trim() !== ''
    )
})

// Quill editor options
const editorOptions = {
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
        ],
    },
}

// FIXME: Try to upload just a docx document adn convert it to html

const updateContent = (content) => {
    newPost.value.content = content
}

// Drag and drop functionality
const isUploading = computed(() => {
    return !!(
        newPost.value.title &&
        newPost.value.content &&
        imageUrl.value &&
        !isProcessing.value
    )
})

const isProcessing = ref(false)

const isDragging = ref(false)
const imageUrl = ref(null)
const draggedFile = ref<File | null>(null)
const storage = getStorage()

const dragOverHandler = () => {
    isDragging.value = true
}

const dragEnterHandler = () => {
    isDragging.value = true
}

const dragLeaveHandler = () => {
    if (!imageUrl.value && !isProcessing.value) {
        isDragging.value = false
    }
}

const dropHandler = (event) => {
    isDragging.value = false
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        draggedFile.value = event.dataTransfer.items[0].getAsFile()
        event.dataTransfer.clearData()
        isProcessing.value = true
        uploadImage()
            .then((url) => {
                imageUrl.value = url
            })
            .catch((error) => {
                console.error('Upload failed:', error)
            })
            .finally(() => {
                isProcessing.value = false
            })
    }
}

const uploadImage = async () => {
    if (!draggedFile.value) return
    const filePath = `posts/${new Date().toISOString()}-${
        draggedFile.value.name
    }`
    const storageReference = storageRef(storage, filePath)

    try {
        const snapshot = await uploadBytesResumable(
            storageReference,
            draggedFile.value
        )

        // Wait for the upload to complete and get the download URL
        const url = await getDownloadURL(snapshot.ref)

        return url
    } catch (error) {
        console.error('Upload failed:', error)
        throw error
    }
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
            isProcessing.value = true
            newPost.value.image = await uploadImage()
            isProcessing.value = false
        } catch (error) {
            alert('Failed to upload image: ' + error.message)
            isProcessing.value = false
            return
        }
    }

    if (newPost.value.title && newPost.value.content && newPost.value.image) {
        console.log(newPost.value)
        await postStore.addPost(newPost.value)
        newPost.value = {
            title: '',
            content: '',
            image: '',
        }
        imageUrl.value = null
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

        .form-group {
            margin: 1rem 0;
        }

        input {
            width: 50%;
        }

        input {
            padding: 0.5em;
            border: 1px solid var(--dark-accent);
            border-radius: 5px;
        }

        .quill-editor-container {
            height: 300px; /* Adjust the height as needed */
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
