import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const photosDir = join(process.cwd(), 'public', 'photos')
  
  console.log('[Photos API] Reading from:', photosDir)
  
  try {
    // 检查目录是否存在
    try {
      await stat(photosDir)
    } catch (err) {
      console.error('[Photos API] Directory not found:', photosDir)
      return {
        success: false,
        error: 'Photos directory not found',
        data: []
      }
    }
    
    // 读取所有月份文件夹
    const folders = await readdir(photosDir, { withFileTypes: true })
    console.log('[Photos API] Found items:', folders.map(f => f.name))
    
    // 过滤出文件夹并按时间倒序排序
    const monthFolders = folders
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => /^\d{4}-\d{2}$/.test(name)) // 只保留 YYYY-MM 格式的文件夹
      .sort((a, b) => b.localeCompare(a)) // 倒序排序，最新的在前
    
    console.log('[Photos API] Month folders:', monthFolders)
    
    // 读取每个月份文件夹中的图片
    const photosByMonth = await Promise.all(
      monthFolders.map(async (folder) => {
        const folderPath = join(photosDir, folder)
        const files = await readdir(folderPath)
        
        console.log(`[Photos API] Files in ${folder}:`, files)
        
        // 过滤图片文件
        const images = files
          .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .map(file => ({
            name: file,
            url: `/photos/${folder}/${file}`,
            month: folder
          }))
        
        return {
          month: folder,
          images
        }
      })
    )
    
    // 过滤掉没有图片的月份
    const result = photosByMonth.filter(month => month.images.length > 0)
    
    console.log('[Photos API] Result:', JSON.stringify(result, null, 2))
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('[Photos API] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read photos',
      data: []
    }
  }
})

