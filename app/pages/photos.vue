<script setup lang="ts">
interface Photo {
  name: string
  url: string
  month: string
}

interface PhotoMonth {
  month: string
  images: Photo[]
}

interface PhotosResponse {
  success: boolean
  data: PhotoMonth[]
}

const { data: photosData, pending, error } = await useFetch<PhotosResponse>('/photos.json')

// 详细的调试信息
console.log('=== Photos Page Debug Info ===')
console.log('Pending:', pending.value)
console.log('Error:', error.value)
console.log('Photos Data:', photosData.value)

if (photosData.value) {
  console.log('Success:', photosData.value.success)
  console.log('Total months:', photosData.value.data.length)

  photosData.value.data.forEach((month, index) => {
    console.log(`Month ${index + 1}: ${month.month}`)
    console.log(`  - Images count: ${month.images.length}`)
    month.images.forEach((img, imgIndex) => {
      console.log(`    Image ${imgIndex + 1}:`, {
        name: img.name,
        url: img.url,
      })
    })
  })
}
console.log('==============================')

// 监听数据变化
watch(photosData, (newData) => {
  console.log('=== Photos Data Updated ===')
  console.log('New data:', newData)
}, { deep: true })

// 格式化月份显示
function formatMonth(month: string) {
  const [year, monthNum] = month.split('-')
  if (!monthNum)
    return month
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${year}年 ${monthNames[Number.parseInt(monthNum) - 1]}`
}

// 图片预览
const selectedImage = ref<string | null>(null)

function openImage(url: string) {
  selectedImage.value = url
}

function closeImage() {
  selectedImage.value = null
}

// 图片懒加载
const loadedImages = ref<Set<string>>(new Set())

function onImageLoad(url: string) {
  loadedImages.value.add(url)
}

function isImageLoaded(url: string) {
  return loadedImages.value.has(url)
}

// 键盘事件处理
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeImage()
    }
  })
})
</script>

<template>
  <div min-h-screen flex="~ col" py-6 sm:py-8 md:py-10 pt-6 md:pt-40>
    <div max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8>
      <h1
        text-2xl sm:text-3xl lg:text-4xl
        font-bold
        mb-6 sm:mb-8 md:mb-10
        class="text-black dark:text-white"
      >
        相册
      </h1>

      <!-- 加载状态 -->
      <div
        v-if="pending"
        text-center
        py-12 sm:py-16 md:py-20
        class="text-gray-600 dark:text-gray-400"
        text-base sm:text-lg
      >
        加载中...
      </div>

      <!-- 错误状态 -->
      <div
        v-else-if="error"
        text-center
        py-12 sm:py-16 md:py-20
        class="text-red-600 dark:text-red-400"
      >
        <p text-base sm:text-lg mb-3 sm:mb-4>
          加载图片失败
        </p>
        <p text-xs sm:text-sm opacity-70>
          {{ error }}
        </p>
        <p text-xs sm:text-sm mt-3 sm:mt-4 opacity-70>
          请尝试重启开发服务器
        </p>
      </div>

      <!-- 相册内容 -->
      <div
        v-else-if="photosData?.success && photosData.data.length > 0"
        flex="~ col"
        gap-10 sm:gap-12 md:gap-16
      >
        <div
          v-for="(monthData, monthIndex) in photosData.data"
          :key="monthData.month"
          class="month-section"
          :style="{ animationDelay: `${monthIndex * 0.1}s` }"
        >
          <!-- 月份标题 -->
          <h2
            text-xl sm:text-2xl lg:text-3xl
            font-semibold
            mb-4 sm:mb-5 md:mb-6
            class="text-black dark:text-white"
          >
            {{ formatMonth(monthData.month) }}
          </h2>

          <!-- 图片网格 -->
          <div
            grid
            gap-2 sm:gap-3 md:gap-4 lg:gap-5
            class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <div
              v-for="(photo, photoIndex) in monthData.images"
              :key="photo.url"
              class="photo-item cursor-pointer overflow-hidden rounded-md sm:rounded-lg aspect-square bg-gray-100 dark:bg-gray-800"
              :style="{ animationDelay: `${(monthIndex * 0.1) + (photoIndex * 0.05)}s` }"
              @click="openImage(photo.url)"
            >
              <!-- 加载占位符 -->
              <div
                v-if="!isImageLoaded(photo.url)"
                class="w-full h-full flex items-center justify-center"
              >
                <div class="loading-spinner" />
              </div>

              <!-- 图片 -->
              <img
                :src="photo.url"
                :alt="photo.name"
                loading="lazy"
                class="w-full h-full object-cover hover:scale-105 sm:hover:scale-110 transition-transform duration-300"
                :class="{ 'image-loaded': isImageLoaded(photo.url) }"
                @load="onImageLoad(photo.url)"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        text-center
        py-12 sm:py-16 md:py-20
        class="text-gray-600 dark:text-gray-400"
        px-4
      >
        <p text-base sm:text-lg>
          还没有照片
        </p>
        <p text-xs sm:text-sm mt-2 opacity-70>
          请在 <code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs sm:text-sm">public/photos/</code> 目录下按月份创建文件夹并添加图片
        </p>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedImage"
          fixed
          inset-0
          bg-black
          bg-opacity-90
          z-50
          flex="~ items-center justify-center"
          class="cursor-zoom-out"
          p-4 sm:p-6 md:p-8
          @click="closeImage"
        >
          <img
            :src="selectedImage"
            alt="预览"
            class="object-contain max-h-[85vh] max-w-[90vw] sm:max-h-[90vh] sm:max-w-[85vw]"
            @click.stop
          >
          <button
            absolute
            top-2 sm:top-4 md:top-6
            right-2 sm:right-4 md:right-6
            text-white
            text-2xl sm:text-3xl md:text-4xl
            opacity-70
            hover:opacity-100
            transition-opacity
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
            flex="~ items-center justify-center"
            @click="closeImage"
          >
            ×
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.month-section {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.photo-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  position: relative;
}

.photo-item img {
  opacity: 0;
  transition: opacity 0.4s ease-in-out, transform 0.3s ease;
}

.photo-item img.image-loaded {
  opacity: 1;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@media (min-width: 640px) {
  .loading-spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }
}

:global(.dark) .loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
