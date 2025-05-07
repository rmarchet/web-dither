import React, { useState, useRef } from 'react';
import ImagePreview from './components/ImagePreview';
import Controls from './components/Controls';
import { DitherSettings, DitherStyle } from './types';
import styles from './styles/App.module.css';

const STORAGE_KEY = 'web-dither-image';
const DEFAULT_SETTINGS: DitherSettings = {
  style: 'None',
  pixelationScale: 1,
  ditheringScale: 1,
  detailEnhancement: 50,
  brightness: 0,
  midtones: 1,
  noise: 0,
  glow: 0,
  luminanceThreshold: -1
};


const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<DitherSettings>(DEFAULT_SETTINGS);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load image from localStorage on mount
  React.useEffect(() => {
    const savedImage = localStorage.getItem(STORAGE_KEY);
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const handleSettingChange = (setting: keyof DitherSettings, value: number | string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const handleCanvasRef = (ref: HTMLCanvasElement | null) => {
    canvasRef.current = ref;
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <ImagePreview
          image={image}
          settings={settings}
          onImageUpload={handleImageUpload}
          onCanvasRef={handleCanvasRef}
        />
        <Controls
          settings={settings}
          onSettingChange={handleSettingChange}
          onReset={handleReset}
        />
      </main>
    </div>
  );
};

export default App; 