import React, { useEffect, useRef } from 'react';
import { DitherSettings } from '../types';
import { applyDither } from '../utils/dither';
import styles from '../styles/ImagePreview.module.css';

interface ImagePreviewProps {
  image: string | null;
  settings: DitherSettings;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCanvasRef: (ref: HTMLCanvasElement | null) => void;
}

const STORAGE_KEY = 'web-dither-image';

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

  // Save image to localStorage when it changes
  useEffect(() => {
    if (image) {
      localStorage.setItem(STORAGE_KEY, image);
    }
  }, [image]);

  // Load image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem(STORAGE_KEY);
    if (savedImage && !image) {
      onImageUpload({ target: { value: savedImage } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, []);

  useEffect(() => {
    if (image && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (!ctx) return;

          // Calculate scaled dimensions based on pixelation scale
          const pixelationScale = settings.pixelationScale;
          const scaledWidth = Math.floor(img.width / pixelationScale);
          const scaledHeight = Math.floor(img.height / pixelationScale);
          
          // Set canvas size
          canvasRef.current.width = scaledWidth * pixelationScale;
          canvasRef.current.height = scaledHeight * pixelationScale;

          // Apply dithering effect with one of the following styles:
          // - Floyd-Steinberg: Classic error diffusion
          // - Ordered: 8x8 ordered dithering
          // - Atkinson: Error diffusion with reduced artifacts
          // - Bayer: 4x4 Bayer matrix dithering
          // - Random: Random noise-based dithering
          // - Stucki: Enhanced error diffusion
          // - Burkes: Simplified error diffusion
          // - Sierra: Balanced error diffusion
          // - Halftone: Classic newspaper-style halftone
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

  const handleClearImage = () => {
    localStorage.removeItem(STORAGE_KEY);
    onImageUpload({ target: { value: null } } as React.ChangeEvent<HTMLInputElement>);
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
            <button onClick={handleClearImage} className={styles.clearButton}>
              Clear Image
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