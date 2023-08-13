<template>
    <div class="form_container">
        <form @submit.prevent="handleLogin">
            <input v-model="email" placeholder="Email" required />
            <input
                type="password"
                v-model="password"
                placeholder="Password"
                required
            />
            <button class="btn btn-sm" type="submit">Login</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

// FIXME: Alert the user if the login was unsuccessful
const handleLogin = async () => {
    let errorObj: Error | null = null

    try {
        await authStore.login(email.value, password.value)
        email.value = ''
        password.value = ''
    } catch (e) {
        errorObj = e as Error
    }

    if (errorObj) {
        alert('Failed to login: ' + errorObj.message)
    }
}
</script>

<style scoped lang="scss">
.form_container {
    form {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;

        input {
            width: 20%;
            margin: 1rem 0;
            padding: 0.5em;
            border: 1px solid var(--dark-accent);
            border-radius: 5px;
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
    }
}

@media screen and (max-width: 768px) {
    .form_container {
        width: 100%;

        form {
            input {
                width: 90%;
            }
        }
    }
}
</style>
