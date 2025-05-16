import { DitherSettings, ImageSettings } from '../types'
import { scaleDitheredImage } from './effects/scaleDitheredImage'
import { preprocessImage } from './effects/preprocessImage'
import * as dither from '../filters/index'

const dithers = Object.values(dither)

const runDither = (image: ImageSettings, settings: DitherSettings) => {
  const { style } = settings
  const dither = dithers.find(d => d.name === style)
  if (dither) {
    dither.apply(image, settings)
  }
}

export const applyDither = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  settings: DitherSettings,
) => {
  const { width, height } = ctx.canvas

  // Clear the canvas
  ctx.clearRect(0, 0, width, height)
  
  // Calculate scaled dimensions for pixelation
  const scaledWidth = Math.floor(width / settings.pixelationScale)
  const scaledHeight = Math.floor(height / settings.pixelationScale)

  // Create a temporary canvas for the intermediate step
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = scaledWidth
  tempCanvas.height = scaledHeight
  const tempCtx = tempCanvas.getContext('2d')!
  
  // Draw scaled down on temp canvas
  tempCtx.imageSmoothingEnabled = false
  tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
  
  // Draw from temp canvas to main canvas with crisp pixels
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(tempCanvas, 0, 0, width, height)
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  if (settings.ditheringScale > 1) {
    const scaled = scaleDitheredImage(ctx, width, height, settings.ditheringScale)
    const { tempCtx: scaledCtx, scaledWidth: ditherWidth, scaledHeight: ditherHeight, imageData: scaledImageData, data: scaledData } = scaled
    preprocessImage({ data: scaledData, width: ditherWidth, height: ditherHeight }, settings)
    runDither({ data: scaledData, width: ditherWidth, height: ditherHeight }, settings)
    scaledCtx.putImageData(scaledImageData, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(scaledCtx.canvas, 0, 0, width, height)
  } else {
    preprocessImage({ data, width, height }, settings)
    runDither({ data, width, height }, settings)
    ctx.putImageData(imageData, 0, 0)
  }

  // Apply glow effect if enabled
  if (settings.glow > 0) {
    ctx.filter = `blur(${settings.glow / 10}px)`
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(ctx.canvas, 0, 0)
    ctx.filter = 'none'
    ctx.globalCompositeOperation = 'source-over'
  }
} 
