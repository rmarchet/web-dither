import { DitherSettings, ImageSettings } from '../../../types'

export const applySierraLite = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const { noise = 0 } = settings

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      let gray = data[idx]
      
      // Add noise
      gray += (Math.random() - 0.5) * noise
      
      // Apply threshold
      const newColor = gray < 128 ? 0 : 255
      data[idx] = data[idx + 1] = data[idx + 2] = newColor
      
      // Calculate error
      const error = gray - newColor
      
      // Distribute error
      if (x < width - 1) {
        data[idx + 4] += error * 2/4 // right
      }
      if (y < height - 1) {
        if (x > 0) {
          data[idx + width * 4 - 4] += error * 1/4 // bottom left
        }
        data[idx + width * 4] += error * 1/4 // bottom
      }
    }
  }
} 
