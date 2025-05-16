export const scaleDitheredImage = (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
  // Create a temporary canvas at reduced size
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = Math.floor(width / scale)
  tempCanvas.height = Math.floor(height / scale)
  const tempCtx = tempCanvas.getContext('2d')!
  
  // Draw the original image scaled down
  tempCtx.imageSmoothingEnabled = false
  tempCtx.drawImage(ctx.canvas, 0, 0, tempCanvas.width, tempCanvas.height)
  
  // Get the scaled down image data
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
  const data = imageData.data
  
  // Return the scaled down context and dimensions
  return { tempCtx, scaledWidth: tempCanvas.width, scaledHeight: tempCanvas.height, imageData, data }
}
