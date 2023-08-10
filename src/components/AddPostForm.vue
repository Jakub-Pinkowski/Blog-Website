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
                    <div
                        class="drag-drop-area"
                        :class="{
                            'drag-over': imageDrop.isDragging.value,
                            'upload-success':
                                imageDrop.contentUrl.value ||
                                imageDrop.isProcessing.value,
                        }"
                        @drop.prevent="(event) => dropHandler(event, imageDrop)"
                        @dragover.prevent="() => dragOverHandler(imageDrop)"
                        @dragenter.prevent="() => dragEnterHandler(imageDrop)"
                        @dragleave.prevent="() => dragLeaveHandler(imageDrop)"
                    >
                        <span
                            class="drag_message"
                            v-if="
                                imageDrop.contentUrl.value !== null &&
                                imageDrop.contentUrl.value !== undefined
                            "
                        >
                            {{ imageDrop.draggedFile.value?.name }}
                        </span>
                        <span
                            class="drag_message"
                            v-else-if="imageDrop.isProcessing.value"
                            >{{ imageDrop.successMessage }}</span
                        >
                        <span v-else>{{ imageDrop.dropMessage }}</span>
                    </div>
                    <div
                        class="drag-drop-area"
                        :class="{
                            'drag-over': htmlDrop.isDragging.value,
                            'upload-success':
                                htmlDrop.contentUrl.value ||
                                htmlDrop.isProcessing.value,
                        }"
                        @drop.prevent="(event) => dropHandler(event, htmlDrop)"
                        @dragover.prevent="() => dragOverHandler(htmlDrop)"
                        @dragenter.prevent="() => dragEnterHandler(htmlDrop)"
                        @dragleave.prevent="() => dragLeaveHandler(htmlDrop)"
                    >
                        <span
                            class="drag_message"
                            v-if="
                                htmlDrop.contentUrl.value !== null &&
                                htmlDrop.contentUrl.value !== undefined
                            "
                        >
                            {{ htmlDrop.draggedFile.value?.name }}
                        </span>
                        <span
                            class="drag_message"
                            v-else-if="htmlDrop.isProcessing.value"
                            >{{ htmlDrop.successMessage }}</span
                        >
                        <span v-else>{{ htmlDrop.dropMessage }}</span>
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

const postStore = usePostStore()
const authStore = useAuthStore()

// Drag and drop functionality
const storage = getStorage()

const imageDrop = {
    isDragging: ref(false),
    isProcessing: ref(false),
    contentUrl: ref<string | null>(null),
    draggedFile: ref<File | null>(null),
    contentType: 'image',
    acceptedType: 'image/*',
    successMessage: 'Image is processing...',
    dropMessage: 'Drop an image here',
}

// TODO: Cosider chanching HTML to Markdown

const htmlDrop = {
    isDragging: ref(false),
    isProcessing: ref(false),
    contentUrl: ref<string | null>(null),
    draggedFile: ref<File | null>(null),
    contentType: 'html',
    acceptedType: 'text/html',
    successMessage: 'HTML is processing...',
    dropMessage: 'Drop an HTML file here',
}

const dragOverHandler = (dropType: typeof imageDrop | typeof htmlDrop) => {
    dropType.isDragging.value = true
}

const dragEnterHandler = (dropType: typeof imageDrop | typeof htmlDrop) => {
    dropType.isDragging.value = true
}

const dragLeaveHandler = (dropType: typeof imageDrop | typeof htmlDrop) => {
    if (!dropType.contentUrl.value && !dropType.isProcessing.value) {
        dropType.isDragging.value = false
    }
}

const dropHandler = async (
    event: DragEvent,
    dropType: typeof imageDrop | typeof htmlDrop
) => {
    dropType.isDragging.value = false

    if (
        event.dataTransfer &&
        event.dataTransfer.items &&
        event.dataTransfer.items.length > 0
    ) {
        const draggedFile = event.dataTransfer.items[0].getAsFile()

        // Check if file is of accepted type
        if (draggedFile) {
            dropType.draggedFile.value = draggedFile
            dropType.isProcessing.value = true

            let result

            if (
                dropType.contentType === 'image' &&
                draggedFile.type.startsWith('image/')
            ) {
                result = await uploadContent(draggedFile, 'image')
            } else if (
                dropType.contentType === 'html' &&
                draggedFile.type === 'text/html'
            ) {
                result = await uploadContent(draggedFile, 'html')
            }

            if (result !== undefined) {
                dropType.contentUrl.value = result
                if (dropType.contentType === 'html') {
                    newPost.value.content = result
                }
            } else {
                console.error(
                    `Upload of ${dropType.contentType} succeeded, but no content was returned.`
                )
            }

            dropType.isProcessing.value = false
        }
    }
}

const uploadContent = async (
    file: File | null,
    type: 'image' | 'html'
): Promise<string | undefined> => {
    if (!file) return

    if (type === 'image') {
        // Create a storage reference from firebase
        const filePath = `posts/${new Date().toISOString()}-${file.name}`
        const storageReference = storageRef(storage, filePath)

        try {
            // Upload file and metadata to the object 'images/mountains.jpg'
            const snapshot = await uploadBytesResumable(storageReference, file)

            // Wait for the upload to complete and get the download URL
            const url = await getDownloadURL(snapshot.ref)

            return url
        } catch (error) {
            console.error('Image upload failed:', error)
            throw error
        }
    } else if (type === 'html') {
        try {
            const content = await file.text()
            return content
        } catch (error) {
            console.error('HTML loading failed:', error)
            throw error
        }
    }
}

// Add new post
const newPost = ref({
    title: '',
    content: '',
    image: '',
    date: '',
})

const addNewPost = async () => {
    // Check if image has been uploaded by the user
    if (imageDrop.contentUrl.value) {
        newPost.value.image = imageDrop.contentUrl.value
    } else {
        alert('Please upload an image before submitting.')
        return
    }

    // Check if HTML has been uploaded
    if (!htmlDrop.contentUrl.value) {
        alert('Please upload an HTML file before submitting.')
        return
    }

    console.log(newPost.value)
    // Check if all fields are filled out
    if (newPost.value.title && newPost.value.content && newPost.value.image) {
        try {
            // Add date to the post in the format of DD-MM-YYYY
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear().toString().slice(-2)
            newPost.value.date = `${day}/${month}/${year}`

            await postStore.addPost(newPost.value)
            alert('Post added successfully!')

            // Reset form
            newPost.value = {
                title: '',
                content: '',
                image: '',
                date: '',
            }
            // Reset drag and drop fields
            imageDrop.contentUrl.value = null
            imageDrop.draggedFile.value = null
            htmlDrop.contentUrl.value = null
            htmlDrop.draggedFile.value = null
        } catch (error) {
            alert('Failed to add the post. Please try again.')
        }
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
            width: 100%;
            padding: 0.5em;
            border: 1px solid var(--dark-accent);
            border-radius: 5px;
        }

        .drag-drop-area {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px dashed #ccc;
            padding: 20px 200px;
            margin-top: 1rem;
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

    .drag_message {
        background-color: #e8f5e9;
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
}

/* Mobile */

@media screen and (max-width: 768px) {
    .admin_panel {

        form {

            .drag-drop-area{
                padding: 20px 70px;
            }
        }
    }
}
</style>
