<script setup lang="ts">
function toggleTheme() {
    // useNuxtApp().$toggleTheme()
}
</script>

<template>
    <nav class="fixed left-10 top-1/2 transform -translate-y-1/2" grid="~ gap-[1.2rem] auto-flow-row">
        <a href="/blog" title="Blog">
            <div w-6 h-6 i-tabler-brand-blogger />
        </a>
        <a href="/diary" title="Diary">
            <div w-6 h-6 i-tabler-brand-blogger />
        </a>
        <a href="/photos" title="Photos">
            <div w-6 h-6 i-tabler-brand-google-photos />
        </a>
        <a href="https://github.com/pkc918" target="_blank" title="Github">
            <div w-6 h-6 i-tabler-brand-github />
        </a>
        <a title="Toggle Theme" @click="toggleTheme">
            <div w-6 h-6 i-tabler-brightness-up dark:i-tabler-brightness-up-filled />
        </a>
    </nav>
</template>