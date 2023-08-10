<template>
    <section class="view_container">
        <h1 class="title">Admin</h1>
        <!-- When logged in -->
        <div v-if="authStore.user">
            <AddPostForm />
        </div>
        <!-- When not logged in -->
        <div v-else>
            <LoginForm />
        </div>
    </section>
</template>

<script setup lang="ts">
// FIXME: Websocket connection is not working

import AddPostForm from '@/components/AddPostForm.vue'
import LoginForm from '@/components/LoginForm.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Authentication
onMounted(() => {
    authStore.initAuth()
})
</script>

<style scoped lang="scss">
.view_container {
    .title {
        margin: 1rem 2rem;
    }
}
</style>
