<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}   

function backHome() {
    navigateTo('/')
}
</script>

<template>
    <div flex="~ col justify-center items-center gap-[1.2rem]">
        <div hover:scale-125 duration-300 rounded-full border="~ 2px solid" class="fcc cursor-pointer border-gray-300 dark:border-gray-700" @click="backHome">
            <img src="/avatar.jpeg" alt="logo" class="w-10 h-10 rounded-full" />
        </div>
        <nav flex="~ col justify-center items-center gap-[1.2rem]" class="[&_a]:w-8 [&_a]:h-8 [&_a]:fcc text-gray-800 dark:text-gray-200">
            <a hover:scale-140 duration-300 href="/blogs" title="Blog">
                <div w-6 h-6 i-tabler-brand-blogger />
            </a>
            <a hover:scale-140 duration-300 href="/diaries" title="Diary">
                <div w-6 h-6 i-tabler-lifebuoy />
            </a>
            <a hover:scale-140 duration-300 href="/photos" title="Photos">
                <div w-6 h-6 i-tabler-brand-google-photos />
            </a>
            <a hover:scale-140 duration-300 href="https://github.com/pkc918" target="_blank" title="Github">
                <div w-6 h-6 i-tabler-brand-github />
            </a>
            <a hover:scale-140 duration-300 cursor-pointer title="Toggle Theme" @click="toggleTheme">
                <div i-tabler-sun dark:i-tabler-moon class="w-6! h-6!" />
            </a>
        </nav>
    </div>
</template>