<template>
    <section class="view_container">
        <h1 class="title">About</h1>
        <div class="about-description">
            <section class="photo">
                <img :src="about_photo" alt="artist-photo" />
            </section>
            <section class="text">
                <section>
                    <h2>{{ about_title }}</h2>
                    <p>
                        {{ description }}
                    </p>
                    <p>
                        {{ other_site }}
                        <a
                            href="https://jules-art.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            >{{ jules_art }}</a
                        >
                    </p>
                </section>
                <ContactForm />
            </section>
        </div>
    </section>
</template>

<script setup lang="ts">
// TODO: Change the photo
import about_photo from '@/assets/images/about.jpg'

import ContactForm from '../components/ContactForm.vue'

const about_title =
    // TODO: Change the title
    'Lorem ipsum dolor sit amet'

const description =
    // TODO: Change the description
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl sed aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc sed nisl. Donec euismod, nisl sed aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc sed nisl.'

const other_site = 'Checkout my other work at '

const jules_art = 'Jules-Art.com'
</script>

<style scoped lang="scss">
.view_container {
    .title {
        margin: 1rem 2rem;
    }
    .about-description {
        margin-top: 5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .photo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;

        img {
            width: 80%;
            height: auto;
            border-radius: 3%;
        }
    }

    .text {
        margin-right: 10rem;
        flex-direction: column;
        justify-content: left;
        display: flex;
        width: 50%;
        text-align: justify;
        text-justify: inter-word;

        p {
            margin: 2rem 0;
            font-size: 1.2rem;
        }
    }
}

/* Mobile */

@media screen and (max-width: 768px) {
    .view_container {
        margin-top: 1rem;

        .title {
            margin-top: 2rem;
        }

        .about-description {
            margin-top: 3rem;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .photo {
            width: 100%;
            margin-bottom: 3rem;

            img {
                width: 90%;
                height: auto;
            }
        }

        .text {
            justify-content: center;
            width: 90%;
            margin: 0 2rem;
        }
    }
}
</style>
