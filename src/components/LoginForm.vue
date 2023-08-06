<template>
    <div>
        <form @submit.prevent="handleLogin">
            <input v-model="email" placeholder="Email" />
            <input type="password" v-model="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

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
</script>

<style scoped lang="scss"></style>
