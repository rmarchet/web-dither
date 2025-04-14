import React, { useState, useCallback, useRef } from 'react';
import styles from './App.module.css';
import { DitherSettings, defaultSettings } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import ImagePreview from './components/ImagePreview';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [settings, setSettings] = useState<DitherSettings>(defaultSettings);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingChange = (setting: keyof DitherSettings, value: number | string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const handleCanvasRef = useCallback((ref: HTMLCanvasElement | null) => {
    canvasRef.current = ref;
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>
        <Controls
          settings={settings}
          onSettingChange={handleSettingChange}
          onReset={handleReset}
        />
        <ImagePreview
          image={image}
          settings={settings}
          onImageUpload={handleImageUpload}
          onCanvasRef={handleCanvasRef}
        />
      </div>
    </div>
  );
};

export default App; 