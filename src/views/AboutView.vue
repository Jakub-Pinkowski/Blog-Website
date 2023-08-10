<template>
    <section id="about" class="view_container">
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
    'Artistic soul. Berlin.'

const description =
    // TODO: Change the description
    "Photography is my passion and I would like to share my best work here. I am interested in traveling, aesthetics, and fashion photography. Recently, I've started diving into videography and I hope to share my first work soon. I will be happy to work on interesting projects and welcome all creative souls to reach out to me via social platforms or the form below."
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
            margin-bottom: 0;
        }

        .about-description {
            margin-top: 2rem;
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
