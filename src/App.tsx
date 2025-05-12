import React, { useState, useRef } from 'react';
import { ImagePreview } from './components/ImagePreview';
import { Controls } from './components/Controls';
import { Footer } from './components/Footer';
import { STORAGE_KEY } from './utils/constants';
import { DEFAULT_SETTINGS } from './utils/controlOptions';
import { DitherSettings, DitherStyle } from './types';
import styles from './styles/App.module.css';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<DitherSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load image from localStorage on mount
  React.useEffect(() => {
    const savedImage = localStorage.getItem(STORAGE_KEY);
    if (savedImage) {
      setImage(savedImage);
    }
    setLoading(false);
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
    setLoading(false);
  };

  const handleCanvasRef = (ref: HTMLCanvasElement | null) => {
    canvasRef.current = ref;
  };

  const handleBeforeImageChange = () => {
    setLoading(true);
  };

  const handleAfterImageChange = () => {
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {loading && <div className={styles.loading}><span>Loading...</span></div>}
        <ImagePreview
          image={image}
          settings={settings}
          onImageUpload={handleImageUpload}
          onCanvasRef={handleCanvasRef}
          onBeforeImageChange={handleBeforeImageChange}
          onAfterImageChange={handleAfterImageChange}
        />
        <Controls
          settings={settings}
          onSettingChange={handleSettingChange}
          onReset={handleReset}
        />
        <Footer /> 
      </main>
    </div>
  );
};

export default App;
