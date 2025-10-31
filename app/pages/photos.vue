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

const { data: photosData, pending, error } = await useFetch<PhotosResponse>('/api/photos')

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
  <div min-h-screen flex="~ col" py-10 pt-40>
    <div max-w-6xl mx-auto w-full px-4>
      <h1 text-3xl font-bold mb-10 class="text-black dark:text-white">
        相册
      </h1>

      <!-- 加载状态 -->
      <div v-if="pending" text-center py-20 class="text-gray-600 dark:text-gray-400">
        加载中...
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" text-center py-20 class="text-red-600 dark:text-red-400">
        <p text-lg mb-4>
          加载图片失败
        </p>
        <p text-sm opacity-70>
          {{ error }}
        </p>
        <p text-sm mt-4 opacity-70>
          请尝试重启开发服务器
        </p>
      </div>

      <!-- 相册内容 -->
      <div v-else-if="photosData?.success && photosData.data.length > 0" flex="~ col" gap-16>
        <div
          v-for="(monthData, monthIndex) in photosData.data"
          :key="monthData.month"
          class="month-section"
          :style="{ animationDelay: `${monthIndex * 0.1}s` }"
        >
          <!-- 月份标题 -->
          <h2 text-2xl font-semibold mb-6 class="text-black dark:text-white">
            {{ formatMonth(monthData.month) }}
          </h2>

          <!-- 图片网格 -->
          <div
            grid
            gap-4
            class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          >
            <div
              v-for="(photo, photoIndex) in monthData.images"
              :key="photo.url"
              class="photo-item cursor-pointer overflow-hidden rounded-lg aspect-square bg-gray-100 dark:bg-gray-800"
              :style="{ animationDelay: `${(monthIndex * 0.1) + (photoIndex * 0.05)}s` }"
              @click="openImage(photo.url)"
            >
              <img
                :src="photo.url"
                :alt="photo.name"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else text-center py-20 class="text-gray-600 dark:text-gray-400">
        <p text-lg>
          还没有照片
        </p>
        <p text-sm mt-2 opacity-70>
          请在 <code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">public/photos/</code> 目录下按月份创建文件夹并添加图片
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
          @click="closeImage"
        >
          <img
            :src="selectedImage"
            alt="预览"
            max-h-90vh
            max-w-90vw
            class="object-contain"
            @click.stop
          >
          <button
            absolute
            top-4
            right-4
            text-white
            text-3xl
            opacity-70
            hover:opacity-100
            transition-opacity
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

.month-section {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.photo-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
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
