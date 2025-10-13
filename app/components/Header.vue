<script setup lang="ts">
interface Link {
    href: string
    title: string
    Icon: string
}
const links: Link[] = [
    {
        href: '/blog',
        title: 'Blog',
        Icon: ''
    },
    {
        href: '/diary',
        title: 'Diary',
        Icon: ''
    },
    {
        href: '/photos',
        title: '',
        Icon: 'i-tabler-brand-google-photos'
    },
    {
        href: 'https://github.com/pkc918',
        title: '',
        Icon: 'i-tabler-brand-github'
    },
]

function toggleTheme() {
    // useNuxtApp().$toggleTheme()
}
</script>

<template>
<header w-full flex="~ justify-end items-center" class="box-border p-[2rem]">
    <nav grid="~ gap-[1.2rem] auto-flow-col">
        <a v-for="link in links" :key="link.href" :href="link.href">
            <div w-6 h-6 v-if="link.Icon" :class="link.Icon"></div>
            <div v-else>{{ link.title }}</div>
        </a>
        <a title="Toggle Theme" @click="toggleTheme">
            <div w-6 h-6 i-tabler-brightness-up dark:i-tabler-brightness-up-filled></div>
        </a>
    </nav>
</header>
</template>