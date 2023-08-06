<template>
    <div class="view">
        <ViewDescription>Admin</ViewDescription>
        <!-- When logged in -->
        <div v-if="authStore.user">
            <AddPostForm />
        </div>
        <!-- When not logged in -->
        <div v-else>
            <LoginForm />
        </div>
    </div>
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
</style>
