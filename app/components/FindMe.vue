<script setup lang="ts">

</script>

<template>
  <div flex="~ col gap-5">
    <p class="text-black dark:text-white" text-sm sm:text-base>
      Find me on
    </p>
    <div
      flex="~ wrap items-center"
      gap-3 sm:gap-4 md:gap-5
      class="justify-start sm:justify-between [&_a]:text-gray-800 dark:[&_a]:text-gray-200 [&_a]:transition-colors [&_a:hover]:text-gray-600 dark:[&_a:hover]:text-gray-400"
    >
      <a
        href="https://github.com/pkc918"
        target="_blank"
        flex="~ items-center gap-1"
        text-xs sm:text-sm
        class="whitespace-nowrap"
      >
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-brand-github flex-shrink-0 />
        <div>Github</div>
      </a>

      <a
        target="_blank"
        flex="~ items-center gap-1"
        text-xs sm:text-sm
        class="whitespace-nowrap"
      >
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-brand-discord flex-shrink-0 />
        <div>pkc918</div>
      </a>

      <a
        href="https://x.com/pkc918"
        target="_blank"
        flex="~ items-center gap-1"
        text-xs sm:text-sm
        class="whitespace-nowrap"
      >
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-brand-x flex-shrink-0 />
        <div>青椒肉丝</div>
      </a>

      <a
        target="_blank"
        flex="~ items-center gap-1"
        text-xs sm:text-sm
        class="whitespace-nowrap"
      >
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-brand-wechat flex-shrink-0 />
        <div>pkc0918</div>
      </a>

      <a
        href="mailto:xiaopan2000918@gmail.com"
        target="_blank"
        flex="~ items-center gap-1"
        text-xs sm:text-sm
        class="whitespace-nowrap break-all sm:break-normal"
      >
        <div w-5 h-5 sm:w-6 sm:h-6 i-tabler-mail-opened flex-shrink-0 />
        <div class="max-w-[150px] sm:max-w-none truncate sm:overflow-visible">
          xiaopan2000918@gmail.com
        </div>
      </a>
    </div>
  </div>
</template>
