import React from 'react'
import { FILE_NAME_PREFIX } from './constants'

export const saveImage = (canvasRef: React.RefObject<HTMLCanvasElement>) => {    
  try {
    // Create a temporary link element
    const link = document.createElement('a')
    link.download = `${FILE_NAME_PREFIX}-${Date.now()}.png`
    
    // Convert canvas to data URL and trigger download
    const dataUrl = canvasRef.current?.toDataURL('image/png')
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Failed to export image:', error)
  }
}
