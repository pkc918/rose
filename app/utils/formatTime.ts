// 格式化日期为 "Apr 28" 格式
export function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}