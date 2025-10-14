<script setup lang="ts">
function toggleTheme() {
    // useNuxtApp().$toggleTheme()
}   
</script>

<template>
    <div flex="~ col justify-center items-center gap-[1.2rem]">
        <div w-12 h-12 p-1 rounded-full border="~ 2px solid black-200" class="fcc">
            <img src="/avatar.jpeg" alt="logo" class="w-10 h-10 rounded-full" />
        </div>
        <nav flex="~ col justify-center items-center gap-[1.2rem]" class="[&_a]:w-8 [&_a]:h-8 [&_a]:fcc">
        <a href="/blog" title="Blog">
            <div w-6 h-6 i-tabler-brand-blogger />
        </a>
        <a href="/diary" title="Diary">
            <div w-6 h-6 i-tabler-lifebuoy />
        </a>
        <a href="/photos" title="Photos">
            <div w-6 h-6 i-tabler-brand-google-photos />
        </a>
        <a href="https://github.com/pkc918" target="_blank" title="Github">
            <div w-6 h-6 i-tabler-brand-github />
        </a>
        <a cursor-pointer title="Toggle Theme" @click="toggleTheme">
            <div w-6 h-6 i-tabler-brightness-up dark:i-tabler-brightness-up-filled />
        </a>
    </nav>
    </div>
</template>