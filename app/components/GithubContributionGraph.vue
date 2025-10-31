<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface ContributionDay {
  date: Date
  count: number
}

// 生成过去一年的贡献数据（示例数据）
function generateContributions(): ContributionDay[] {
  const contributions: ContributionDay[] = []
  const today = new Date()
  const oneYearAgo = new Date(today)
  oneYearAgo.setFullYear(today.getFullYear() - 1)

  // 从一年前的周日开始
  const startDate = new Date(oneYearAgo)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  // 生成53周的数据
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + week * 7 + day)

      if (date <= today) {
        // 随机生成贡献数（0-20）
        const count = Math.floor(Math.random() * 21)
        contributions.push({ date, count })
      }
    }
  }

  return contributions
}

const contributions = generateContributions()
const containerRef = ref<HTMLElement | null>(null)
const cellSize = ref(12) // 默认格子大小 (px)
const gap = ref(4) // 默认间距 (px)

// 按周分组
const weeks = computed(() => {
  const result: ContributionDay[][] = []
  let week: ContributionDay[] = []

  contributions.forEach((day, index) => {
    week.push(day)
    if ((index + 1) % 7 === 0) {
      result.push(week)
      week = []
    }
  })

  if (week.length > 0) {
    result.push(week)
  }

  return result
})

// 动态计算格子大小
function calculateCellSize() {
  if (!containerRef.value)
    return

  const containerWidth = containerRef.value.offsetWidth
  const weekCount = weeks.value.length
  const monthLabelHeight = 24 // 月份标签高度
  const legendHeight = 32 // 图例高度

  // 计算最适合的格子大小
  // 公式: (cellSize + gap) * weekCount = containerWidth
  const availableWidth = containerWidth - 20 // 留出一些边距
  const totalGaps = weekCount - 1

  // 计算格子大小，确保不超过容器宽度
  const calculatedSize = Math.floor((availableWidth - totalGaps * gap.value) / weekCount)

  // 限制格子大小范围: 最小 8px，最大 14px
  cellSize.value = Math.max(8, Math.min(14, calculatedSize))
}

onMounted(() => {
  calculateCellSize()

  // 监听窗口大小变化
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', calculateCellSize)
  }
})

onUnmounted(() => {
  // 清理事件监听器
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', calculateCellSize)
  }
})

// 获取显示的月份（动态计算位置）
const months = computed(() => {
  const monthLabels: { label: string, offset: number }[] = []
  let lastMonth = -1

  contributions.forEach((day, index) => {
    const month = day.date.getMonth()
    const weekIndex = Math.floor(index / 7)

    // 只在月份改变时添加标签
    if (month !== lastMonth) {
      monthLabels.push({
        label: day.date.toLocaleDateString('en-US', { month: 'short' }),
        offset: weekIndex,
      })
      lastMonth = month
    }
  })

  return monthLabels
})

// 获取颜色等级
function getLevel(count: number): number {
  if (count === 0)
    return 0
  if (count <= 3)
    return 1
  if (count <= 6)
    return 2
  if (count <= 9)
    return 3
  return 4
}

// 总贡献数
const totalContributions = computed(() => {
  return contributions.reduce((sum, day) => sum + day.count, 0)
})

// 计算月份标签位置
function getMonthOffset(offset: number) {
  return `${offset * (cellSize.value + gap.value)}px`
}
</script>

<template>
  <div ref="containerRef" w-full m-1>
    <!-- 贡献图容器 - 可横向滚动 -->
    <div w-full overflow-x-auto pb-2>
      <div inline-block min-w-full>
        <!-- 月份标签 -->
        <div flex mb-2 text-xs text-gray-600 dark:text-gray-400 h-5>
          <div
            v-for="(month, index) in months"
            :key="`${month.label}-${index}`"
            :style="{
              width: index === months.length - 1
                ? 'auto'
                : `${((months[index + 1]?.offset ?? weeks.length) - month.offset) * (cellSize + gap)}px`,
              minWidth: '30px',
            }"
          >
            {{ month.label }}
          </div>
        </div>

        <!-- 贡献图 -->
        <div flex :style="{ gap: `${gap}px`, width: 'fit-content' }">
          <div
            v-for="(week, weekIndex) in weeks"
            :key="weekIndex"
            flex="~ col"
            :style="{ gap: `${gap}px` }"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              rounded-sm
              transition-all duration-200
              cursor-pointer
              :style="{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                minWidth: `${cellSize}px`,
                minHeight: `${cellSize}px`,
              }"
              :title="`${day.date.toLocaleDateString()}: ${day.count} contributions`"
              class="dark:bg-opacity-100" :class="[
                // Light mode colors
                day.count === 0 && 'bg-gray-100',
                getLevel(day.count) === 1 && 'bg-gray-300',
                getLevel(day.count) === 2 && 'bg-gray-500',
                getLevel(day.count) === 3 && 'bg-gray-700',
                getLevel(day.count) === 4 && 'bg-gray-900',
                day.count === 0 && 'dark:bg-gray-800',
                getLevel(day.count) === 1 && 'dark:bg-orange-200/30',
                getLevel(day.count) === 2 && 'dark:bg-orange-300/50',
                getLevel(day.count) === 3 && 'dark:bg-orange-400/70',
                getLevel(day.count) === 4 && 'dark:bg-orange-500/90',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <div flex="~ items-center justify-between gap-2">
      <span text-sm text-gray-600 dark:text-gray-400>
        {{ totalContributions }} contributions in the last year
      </span>
      <!-- 图例 - 固定在底部不滚动 -->
      <div flex="~ items-center gap-2" text-xs text-gray-600 dark:text-gray-400>
        <span>Less</span>
        <div flex gap-1>
          <div
            rounded-sm
            bg-gray-100 dark:bg-gray-800
            :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          />
          <div
            rounded-sm
            class="bg-gray-300 dark:bg-orange-200/30"
            :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          />
          <div
            rounded-sm
            class="bg-gray-500 dark:bg-orange-300/50"
            :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          />
          <div
            rounded-sm
            class="bg-gray-700 dark:bg-orange-400/70"
            :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          />
          <div
            rounded-sm
            class="bg-gray-900 dark:bg-orange-500/90"
            :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
          />
        </div>
        <span>More</span>
      </div>
    </div>
  </div>
</template>
