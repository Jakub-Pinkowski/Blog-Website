<template>
    <div class="body">
        <TheHeader class="desktop" />
        <TheNavigation class="mobile" />
        <main>
            <router-view v-slot="{ Component }">
                <transition name="slide-blur" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <TheFooter />
    </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavigation from '@/components/TheNavigation.vue'
</script>

<style lang="scss">
/* Desktop vs Mobile */
.desktop {
    display: block;
}

.mobile {
    display: none;
}

@media screen and (max-width: 768px) {
    .desktop {
        display: none;
    }

    .mobile {
        display: block;
    }
}

/* Global styles */

// TODO: Make safati recognize the background-color
*,
html,
main {
    background-color: var(--light-bg-color);
}

.body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--light-bg-color);
}

h1 {
    color: var(--dark-gray);
    font-size: 2.5rem;
    font-weight: 700;
}

h2 {
    color: var(--dark-gray);
    font-size: 1.8rem;
    font-weight: 500;
}

h3 {
    color: var(--dark-gray);
    font-size: 1.5rem;
    font-weight: 400;
}

h4 {
    color: var(--dark-gray);
    font-size: 1.2rem;
    font-weight: 400;
}

p {
    color: var(--dark-gray);
    font-size: 1rem;
    font-weight: 300;
}

span {
    color: var(--dark-gray);
    font-size: 1rem;
    font-weight: 300;
}

/* Transition between views */

.slide-blur-enter-active {
    transition: all 0.3s ease;
}

.slide-blur-leave-active {
    transition: all 0.3s ease-in-out;
}

.slide-blur-enter {
    transform: translateX(-10px);
    filter: blur(2px);
    opacity: 0;
}

.slide-blur-leave-to {
    transform: translateX(10px);
    filter: blur(2px);
    opacity: 0;
}
</style>
