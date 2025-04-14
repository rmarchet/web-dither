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

  useEffect(() => {
    onCanvasRef(canvasRef.current);
  }, [onCanvasRef]);

  useEffect(() => {
    if (image && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (!ctx) return;

          // Set canvas size to match image, considering pixelation scale
          const scaledWidth = Math.floor(img.width / settings.pixelationScale);
          const scaledHeight = Math.floor(img.height / settings.pixelationScale);
          canvasRef.current.width = scaledWidth * settings.pixelationScale;
          canvasRef.current.height = scaledHeight * settings.pixelationScale;

          // Draw and scale down the image
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          ctx.drawImage(canvasRef.current, 0, 0, scaledWidth, scaledHeight, 0, 0, canvasRef.current.width, canvasRef.current.height);

          // Apply dithering effect
          applyDither(ctx, img, settings);
        }
      };
      img.src = image;
    }
  }, [image, settings]);

  return (
    <div className={styles.imageArea}>
      {!image && (
        <label className={styles.uploadArea}>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={onImageUpload}
          />
          <div className={styles.uploadText}>Drop image here or click to upload</div>
        </label>
      )}
      {image && (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}
    </div>
  );
};

export default ImagePreview; 