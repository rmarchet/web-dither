import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { DitherSettings } from '../types';
import { applyDither } from '../utils/dither';
import { STORAGE_KEY } from '../utils/constants';
import { Actions } from './Actions';
import { saveImage } from '../utils/saveImage';
import styles from '../styles/ImagePreview.module.css';

interface ImagePreviewProps {
  image: string | null;
  settings: DitherSettings;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCanvasRef: (ref: HTMLCanvasElement | null) => void;
  onBeforeImageChange: () => void;
  onAfterImageChange: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  settings,
  onImageUpload,
  onCanvasRef,
  onBeforeImageChange,
  onAfterImageChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // Update loading state when settings change
  useEffect(() => {
    onBeforeImageChange();
  }, [settings]);

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
      try {
        localStorage.setItem(STORAGE_KEY, image);
      } catch (e) {
        console.error(e)
      }
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
    onBeforeImageChange();
    setTimeout(() => {
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

            // Apply dithering effect with one of the available styles
            applyDither(ctx, img, settings);
          }
        };
        img.src = image;
      }
      onAfterImageChange();
    }, 50);
  }, [image, settings]);

  // Draw original image to originalCanvasRef
  useEffect(() => {
    if (image && originalCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (originalCanvasRef.current) {
          const ctx = originalCanvasRef.current.getContext('2d');
          if (!ctx) return;
          originalCanvasRef.current.width = img.width;
          originalCanvasRef.current.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
        }
      };
      img.src = image;
    }
  }, [image]);

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleExport = () => {
    if (!canvasRef.current || !image) return;
    saveImage(canvasRef);
  };

  const handleClearImage = () => {
    localStorage.removeItem(STORAGE_KEY);
    onImageUpload({ target: { value: null } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleShowOriginal = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setShowOriginal(true);
    }
  };
  const handleHideOriginal = () => setShowOriginal(false);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onImageUpload({
        target: {
          files: event.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <div className={styles.imageArea}>
      {!image && (
        <label
          className={styles.uploadArea}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
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
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={handleShowOriginal}
            onMouseUp={handleHideOriginal}
            onMouseLeave={handleHideOriginal}
            onTouchStart={handleShowOriginal}
            onTouchEnd={handleHideOriginal}
          />
          <canvas
            ref={originalCanvasRef}
            className={cn(styles.canvas, styles.originalCanvas, showOriginal ? styles.show : styles.hide)}
            tabIndex={-1}
          />
          <Actions
            onChangeImage={handleChangeClick}
            onExport={handleExport}
            onClearImage={handleClearImage}
          />
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
