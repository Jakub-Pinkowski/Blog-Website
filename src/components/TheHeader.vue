<template>
    <nav class="navbar navbar-expand-md">
        <div class="container-fluid">
            <router-link class="nav-link" to="/">
                <img :src="plane_color_icon" alt="plane icon" />
            </router-link>
            <div class="collapse navbar-collapse navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li v-for="view in views" class="nav-item">
                        <router-link class="nav-link" :to="view.route">{{
                            view.name
                        }}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useViewStore } from '@/stores/views'

import plane_icon from '../assets/icons/plane.png'
import plane_color_icon from '../assets/icons/plane-color.png'

const viewStore = useViewStore()
const views = viewStore.views
</script>

<style scoped lang="scss">
.nav-link {
    margin: 0.5rem 1.2rem;
    font-size: 1.2rem;
    color: var(--main-bg-color);
}

.nav-link:hover {
    color: var(--accent-color);
}

.navbarSupportedContent {
    display: flex;
    justify-content: flex-end;

    li {
        font-weight: 600;
    }
}
</style>
