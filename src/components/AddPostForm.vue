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
                            <span v-if="imageUrl">{{ draggedFile?.name }}</span>
                            <span v-else-if="isProcessing"
                                >Image is processing...</span
                            >
                            <span v-else>Drop an image here</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div
                            class="drag-drop-area"
                            :class="{
                                'drag-over': isDraggingHTML,
                                'upload-success':
                                    htmlContent || isProcessingHTML,
                            }"
                            @drop.prevent="dropHandlerHTML"
                            @dragover.prevent="dragOverHandlerHTML"
                            @dragenter.prevent="dragEnterHandlerHTML"
                            @dragleave.prevent="dragLeaveHandlerHTML"
                        >
                            <span v-if="htmlContent">HTML File Loaded</span>
                            <span v-else-if="isProcessingHTML"
                                >HTML is processing...</span
                            >
                            <span v-else>Drop an HTML file here</span>
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

const postStore = usePostStore()
const authStore = useAuthStore()

const isFormValid = computed(() => {
    return (
        newPost.value.title.trim() !== '' && newPost.value.content.trim() !== ''
    )
})

// FIXME: Try to upload just a docx document and convert it to html

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
const imageUrl = ref<string | null>(null)
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

const dropHandler = (event: DragEvent) => {
    isDragging.value = false
    if (
        event.dataTransfer &&
        event.dataTransfer.items &&
        event.dataTransfer.items.length > 0
    ) {
        draggedFile.value = event.dataTransfer.items[0].getAsFile()
        event.dataTransfer.clearData()
        isProcessing.value = true

        uploadImage()
            .then((url) => {
                if (url !== undefined) {
                    imageUrl.value = url
                } else {
                    // Handle the case when url is undefined if necessary
                    console.error('Upload succeeded, but no URL was returned.')
                }
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

// Drag and drop functionality for HTML
const isDraggingHTML = ref(false)
const isProcessingHTML = ref(false)
const htmlContent = ref<string | null>(null)
const draggedHTMLFile = ref<File | null>(null)

const dragOverHandlerHTML = () => {
    isDraggingHTML.value = true
}

const dragEnterHandlerHTML = () => {
    isDraggingHTML.value = true
}

const dragLeaveHandlerHTML = () => {
    if (!htmlContent.value && !isProcessingHTML.value) {
        isDraggingHTML.value = false
    }
}

const dropHandlerHTML = (event: DragEvent) => {
    isDraggingHTML.value = false
    if (
        event.dataTransfer &&
        event.dataTransfer.items &&
        event.dataTransfer.items.length > 0 &&
        event.dataTransfer.items[0].type === 'text/html' // Ensure it's an HTML file
    ) {
        draggedHTMLFile.value = event.dataTransfer.items[0].getAsFile()
        event.dataTransfer.clearData()
        isProcessingHTML.value = true

        loadHTMLContent()
            .then((content) => {
                if (content !== undefined) {
                    htmlContent.value = content
                    newPost.value.content = content
                } else {
                    console.error(
                        'Upload succeeded, but no content was returned.'
                    )
                }
            })
            .catch((error) => {
                console.error('HTML loading failed:', error)
            })
            .finally(() => {
                isProcessingHTML.value = false
            })
    }
}

const loadHTMLContent = async () => {
    if (!draggedHTMLFile.value) return

    try {
        const content = await draggedHTMLFile.value.text()
        return content
    } catch (error) {
        console.error('Loading failed:', error)
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
            const uploadResult = await uploadImage()

            if (typeof uploadResult === 'string') {
                newPost.value.image = uploadResult
            } else {
                throw new Error('Image upload returned an undefined URL.')
            }

            isProcessing.value = false
        } catch (error) {
            isProcessing.value = false

            if (
                typeof error === 'object' &&
                error !== null &&
                'message' in error
            ) {
                alert('Failed to upload image: ' + error.message)
            } else {
                alert('Failed to upload image.')
            }

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
