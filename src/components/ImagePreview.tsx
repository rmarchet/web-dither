import React, { useEffect, useRef } from 'react';
import styles from '../App.module.css';
import { DitherSettings } from '../types';
import { applyDither } from '../utils/dither';

interface ImagePreviewProps {
  image: string | null;
  settings: DitherSettings;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCanvasRef: (ref: HTMLCanvasElement | null) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  settings,
  onImageUpload,
  onCanvasRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update canvas ref whenever it changes
  useEffect(() => {
    if (canvasRef.current) {
      onCanvasRef(canvasRef.current);
    }
    return () => onCanvasRef(null);
  }, [onCanvasRef]);

  useEffect(() => {
    if (image && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (!ctx) return;

          // Calculate scaled dimensions
          const scale = settings.pixelationScale;
          const scaledWidth = Math.floor(img.width / scale);
          const scaledHeight = Math.floor(img.height / scale);
          
          // Set canvas size
          canvasRef.current.width = scaledWidth * scale;
          canvasRef.current.height = scaledHeight * scale;

          // Apply dithering effect (which now includes drawing the image)
          applyDither(ctx, img, settings);
        }
      };
      img.src = image;
    }
  }, [image, settings]);

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleExport = () => {
    if (!canvasRef.current || !image) return;
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'dithered-image.png';
      
      // Convert canvas to data URL and trigger download
      const dataUrl = canvasRef.current.toDataURL('image/png');
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  return (
    <div className={styles.imageArea}>
      {!image && (
        <label className={styles.uploadArea}>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={onImageUpload}
          />
          <div className={styles.uploadText}>Drop image here or click to upload</div>
        </label>
      )}
      {image && (
        <div className={styles.imageContainer}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.imageButtons}>
            <button onClick={handleChangeClick} className={styles.changeImageButton}>
              Change Image
            </button>
            <button onClick={handleExport} className={styles.exportButton}>
              Export
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={onImageUpload}
          />
        </div>
      )}
    </div>
  );
};

export default ImagePreview; 