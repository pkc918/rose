<script setup lang="ts">
const colorMode = useColorMode()
const isAnimating = ref(false)

async function toggleTheme(event: MouseEvent) {
  if (isAnimating.value)
    return

  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    return
  }

  isAnimating.value = true

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition(async () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: colorMode.value === 'dark'
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards',
        pseudoElement: colorMode.value === 'dark'
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })

  transition.finished.then(() => {
    isAnimating.value = false
  })
}

function backHome() {
  navigateTo('/')
}
</script>

<template>
  <!-- 移动端水平布局 -->
  <div class="flex md:hidden flex-row justify-center items-center gap-4 sm:gap-6">
    <div
      hover:scale-110
      duration-300
      rounded-full
      border="~ 2px solid"
      class="fcc cursor-pointer border-gray-300 dark:border-gray-700"
      @click="backHome"
    >
      <img src="/avatar.jpeg" alt="logo" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full">
    </div>
    <nav flex="~ row justify-center items-center gap-4 sm:gap-6" class="[&_a]:w-8 [&_a]:h-8 [&_a]:fcc text-gray-800 dark:text-gray-200">
      <a hover:scale-125 duration-300 href="/blogs" title="Blog">
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-brand-blogger />
      </a>
      <a hover:scale-125 duration-300 href="/diaries" title="Diary">
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-lifebuoy />
      </a>
      <a hover:scale-125 duration-300 href="https://github.com/pkc918" target="_blank" title="Github">
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-brand-github />
      </a>
      <a hover:scale-125 duration-300 cursor-pointer title="Toggle Theme" @click="toggleTheme">
        <div i-tabler-sun dark:i-tabler-moon class="w-5! h-5! sm:w-6! sm:h-6!" />
      </a>
    </nav>
  </div>

  <!-- 桌面端垂直布局 -->
  <div class="hidden md:flex flex-col justify-center items-center gap-[1.2rem]">
    <div hover:scale-125 duration-300 rounded-full border="~ 2px solid" class="fcc cursor-pointer border-gray-300 dark:border-gray-700" @click="backHome">
      <img src="/avatar.jpeg" alt="logo" class="w-10 h-10 rounded-full">
    </div>
    <nav flex="~ col justify-center items-center gap-[1.2rem]" class="[&_a]:w-8 [&_a]:h-8 [&_a]:fcc text-gray-800 dark:text-gray-200">
      <a hover:scale-140 duration-300 href="/blogs" title="Blog">
        <div w-6 h-6 i-tabler-brand-blogger />
      </a>
      <a hover:scale-140 duration-300 href="/diaries" title="Diary">
        <div w-6 h-6 i-tabler-lifebuoy />
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
