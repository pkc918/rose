---
theme: z-blue
highlight: agate
title: 使用 opencv 对图片做透视矫正
date: 2026-08-25
---

按照图片边界点，对图片做透视矫正

```ts

import type { CV, Mat } from '@techstark/opencv-js'

export type PerspectiveImageSource = string | Blob | HTMLImageElement | HTMLCanvasElement

export interface PerspectiveCorrectionResult {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

interface ResolvedImageSource {
  element: HTMLImageElement | HTMLCanvasElement
  cleanup: () => void
}

interface OpenCvRuntime {
  onRuntimeInitialized?: () => void
}

const OPEN_CV_LOAD_TIMEOUT = 60_000

let openCvPromise: Promise<CV> | null = null

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object'
    && value !== null
    && 'then' in value
    && typeof value.then === 'function'
}

function isOpenCvReady(value: unknown): value is CV {
  if (typeof value !== 'object' || value === null)
    return false

  const candidate = value as {
    Mat?: unknown
    getPerspectiveTransform?: unknown
    warpPerspective?: unknown
  }

  return typeof candidate.Mat === 'function'
    && typeof candidate.getPerspectiveTransform === 'function'
    && typeof candidate.warpPerspective === 'function'
}

async function loadOpenCv(): Promise<CV> {
  const importedModule = await import('@techstark/opencv-js')
  const moduleWithDefault = importedModule as unknown as { default?: unknown }
  let candidate: unknown = moduleWithDefault.default ?? importedModule

  if (isPromiseLike(candidate))
    candidate = await candidate

  if (isOpenCvReady(candidate))
    return candidate

  if (typeof candidate !== 'object' || candidate === null)
    throw new Error('OpenCV.js 模块加载失败')

  const runtime = candidate as OpenCvRuntime

  return await new Promise<CV>((resolve, reject) => {
    let settled = false
    const previousInitializer = runtime.onRuntimeInitialized

    const timeout = window.setTimeout(() => {
      if (settled)
        return

      settled = true
      reject(new Error('OpenCV.js 初始化超时'))
    }, OPEN_CV_LOAD_TIMEOUT)

    const complete = () => {
      if (settled)
        return

      if (!isOpenCvReady(candidate)) {
        settled = true
        window.clearTimeout(timeout)
        reject(new Error('OpenCV.js 初始化失败'))
        return
      }

      settled = true
      window.clearTimeout(timeout)
      resolve(candidate)
    }

    runtime.onRuntimeInitialized = () => {
      try {
        previousInitializer?.()
      }
      finally {
        complete()
      }
    }

    // 避免模块在检查和注册回调之间完成初始化造成永久等待。
    if (isOpenCvReady(candidate))
      complete()
  })
}

async function getOpenCv(): Promise<CV> {
  if (!openCvPromise) {
    openCvPromise = loadOpenCv().catch((error) => {
      openCvPromise = null
      throw error
    })
  }

  return await openCvPromise
}

function loadHtmlImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('透视矫正图片加载失败'))
    image.src = source
  })
}

async function ensureHtmlImageReady(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)
    return

  await new Promise<void>((resolve, reject) => {
    image.addEventListener('load', () => resolve(), { once: true })
    image.addEventListener('error', () => reject(new Error('透视矫正图片加载失败')), { once: true })
  })
}

async function resolveImageSource(source: PerspectiveImageSource): Promise<ResolvedImageSource> {
  if (source instanceof HTMLCanvasElement) {
    if (source.width <= 0 || source.height <= 0)
      throw new Error('透视矫正图片尺寸无效')

    return {
      element: source,
      cleanup: () => {},
    }
  }

  if (source instanceof HTMLImageElement) {
    await ensureHtmlImageReady(source)
    return {
      element: source,
      cleanup: () => {},
    }
  }

  let objectUrl: string | null = null
  let sourceUrl: string

  if (typeof source === 'string') {
    sourceUrl = source
  }
  else {
    objectUrl = URL.createObjectURL(source)
    sourceUrl = objectUrl
  }

  try {
    const element = await loadHtmlImage(sourceUrl)
    return {
      element,
      cleanup: () => {
        if (objectUrl)
          URL.revokeObjectURL(objectUrl)
      },
    }
  }
  catch (error) {
    if (objectUrl)
      URL.revokeObjectURL(objectUrl)
    throw error
  }
}

function getSourceSize(source: HTMLImageElement | HTMLCanvasElement): Size {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth,
      height: source.naturalHeight,
    }
  }

  return {
    width: source.width,
    height: source.height,
  }
}

export function validatePerspectiveEdge(edge: Edge): void {
  const points: [Position, Position, Position, Position] = [
    edge.left_top,
    edge.right_top,
    edge.right_bottom,
    edge.left_bottom,
  ]

  const hasInvalidCoordinate = points.some(point =>
    !Number.isFinite(point.x)
    || !Number.isFinite(point.y)
    || point.x < 0
    || point.x > 1
    || point.y < 0
    || point.y > 1,
  )

  if (hasInvalidCoordinate)
    throw new Error('Edge 坐标必须是 0 到 1 之间的有效数值')

  const getCrossProduct = (point: Position, next: Position, afterNext: Position) =>
    (next.x - point.x) * (afterNext.y - next.y)
    - (next.y - point.y) * (afterNext.x - next.x)

  const crossProducts = [
    getCrossProduct(points[0], points[1], points[2]),
    getCrossProduct(points[1], points[2], points[3]),
    getCrossProduct(points[2], points[3], points[0]),
    getCrossProduct(points[3], points[0], points[1]),
  ]

  const epsilon = 1e-8
  const hasPositive = crossProducts.some(value => value > epsilon)
  const hasNegative = crossProducts.some(value => value < -epsilon)
  const hasCollinearEdge = crossProducts.some(value => Math.abs(value) <= epsilon)

  if (hasCollinearEdge || (hasPositive && hasNegative))
    throw new Error('Edge 四个点必须按左上、右上、右下、左下组成有效凸四边形')
}

function getDistance(point1: Position, point2: Position, sourceSize: Size): number {
  const deltaX = (point2.x - point1.x) * sourceSize.width
  const deltaY = (point2.y - point1.y) * sourceSize.height

  return Math.hypot(deltaX, deltaY)
}

function calculateOutputSize(edge: Edge, sourceSize: Size): Size {
  const widthTop = getDistance(edge.left_top, edge.right_top, sourceSize)
  const widthBottom = getDistance(edge.left_bottom, edge.right_bottom, sourceSize)
  const heightLeft = getDistance(edge.left_top, edge.left_bottom, sourceSize)
  const heightRight = getDistance(edge.right_top, edge.right_bottom, sourceSize)

  const width = Math.round(Math.max(widthTop, widthBottom))
  const height = Math.round(Math.max(heightLeft, heightRight))

  if (width < 2 || height < 2)
    throw new Error('Edge 对应的透视矫正区域尺寸无效')

  return { width, height }
}

function createSourcePoints(cv: CV, edge: Edge, sourceSize: Size): Mat {
  return cv.matFromArray(
    4,
    1,
    cv.CV_32FC2,
    [
      edge.left_top.x * sourceSize.width,
      edge.left_top.y * sourceSize.height,
      edge.right_top.x * sourceSize.width,
      edge.right_top.y * sourceSize.height,
      edge.right_bottom.x * sourceSize.width,
      edge.right_bottom.y * sourceSize.height,
      edge.left_bottom.x * sourceSize.width,
      edge.left_bottom.y * sourceSize.height,
    ],
  )
}

function createTargetPoints(cv: CV, outputSize: Size): Mat {
  return cv.matFromArray(
    4,
    1,
    cv.CV_32FC2,
    [
      0,
      0,
      outputSize.width - 1,
      0,
      outputSize.width - 1,
      outputSize.height - 1,
      0,
      outputSize.height - 1,
    ],
  )
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error)
    return error

  return new Error(typeof error === 'string' ? error : '图片透视矫正失败')
}

export function usePerspectiveCorrection() {
  const processing = ref(false)
  const ready = ref(false)
  const error = shallowRef<Error | null>(null)
  let activeOperations = 0

  async function correctPerspective(
    imageSource: PerspectiveImageSource,
    edge: Edge,
  ): Promise<PerspectiveCorrectionResult> {
    if (!import.meta.client)
      throw new Error('图片透视矫正只能在浏览器中执行')

    activeOperations += 1
    processing.value = true
    error.value = null

    let source: Mat | null = null
    let result: Mat | null = null
    let sourcePoints: Mat | null = null
    let targetPoints: Mat | null = null
    let transformMatrix: Mat | null = null
    let resolvedImage: ResolvedImageSource | null = null

    try {
      validatePerspectiveEdge(edge)

      const cv = await getOpenCv()
      ready.value = true

      resolvedImage = await resolveImageSource(imageSource)

      const sourceSize = getSourceSize(resolvedImage.element)
      const outputSize = calculateOutputSize(edge, sourceSize)

      source = cv.imread(resolvedImage.element)
      result = new cv.Mat()
      sourcePoints = createSourcePoints(cv, edge, sourceSize)
      targetPoints = createTargetPoints(cv, outputSize)
      transformMatrix = cv.getPerspectiveTransform(sourcePoints, targetPoints)

      cv.warpPerspective(
        source,
        result,
        transformMatrix,
        new cv.Size(outputSize.width, outputSize.height),
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar(0, 0, 0, 0),
      )

      const canvas = document.createElement('canvas')
      canvas.width = outputSize.width
      canvas.height = outputSize.height
      cv.imshow(canvas, result)

      return {
        canvas,
        width: outputSize.width,
        height: outputSize.height,
      }
    }
    catch (cause) {
      const currentError = normalizeError(cause)
      error.value = currentError
      throw currentError
    }
    finally {
      transformMatrix?.delete()
      targetPoints?.delete()
      sourcePoints?.delete()
      result?.delete()
      source?.delete()
      resolvedImage?.cleanup()
      activeOperations = Math.max(0, activeOperations - 1)
      processing.value = activeOperations > 0
    }
  }

  return {
    processing: readonly(processing),
    ready: readonly(ready),
    error: readonly(error),
    correctPerspective,
  }
}

```