import dayjs from 'dayjs'

// 格式化日期为 "Apr 28" 格式
export function formatDate(dateString: string) {
  return dayjs(dateString).format('MMM D')
}
