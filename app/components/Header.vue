<script setup lang="ts">
function toggleTheme() {
    // useNuxtApp().$toggleTheme()
}
</script>

<template>
<header w-full flex="~ justify-end items-center" class="box-border p-[2rem]">
    <nav grid="~ gap-[1.2rem] auto-flow-col">
        <a href="/blog" title="Blog">
            <div font-bold>Blog</div>
        </a>
        <a href="/diary" title="Diary">
            <div font-bold>Diary</div>
        </a>
        <a href="/photos" title="Photos">
            <div w-6 h-6 i-tabler-brand-google-photos></div>
        </a>
        <a href="https://github.com/pkc918" target="_blank" title="Github">
            <div w-6 h-6 i-tabler-brand-github></div>
        </a>
        <a title="Toggle Theme" @click="toggleTheme">
            <div w-6 h-6 i-tabler-brightness-up dark:i-tabler-brightness-up-filled></div>
        </a>
    </nav>
</header>
</template>