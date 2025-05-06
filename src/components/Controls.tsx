import React from 'react';
import styles from '../App.module.css';
import { DITHER_STYLES, DITHER_OPTIONS, SCALED_STYLES } from '../utils/constants';
import { DitherSettings, DitherStyle } from '../types';

interface ControlsProps {
  settings: DitherSettings;
  onSettingChange: (setting: keyof DitherSettings, value: number | string) => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  settings,
  onSettingChange,
  onReset
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>Style</label>
        <select 
          className={styles.select}
          value={settings.style}
          onChange={(e) => onSettingChange('style', e.target.value as DitherStyle)}
        >
          {Object.entries(DITHER_OPTIONS).map(([group, styles]) => (
            <optgroup key={group} label={group}>
              {styles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Pixelation Scale
          <span className={styles.value}>{settings.pixelationScale}</span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={settings.pixelationScale}
          onChange={(e) => onSettingChange('pixelationScale', Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      {SCALED_STYLES.includes(settings.style) && (
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Dithering Scale
            <span className={styles.value}>{settings.ditheringScale}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={settings.ditheringScale}
            onChange={(e) => onSettingChange('ditheringScale', Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      )}

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Detail Enhancement
          <span className={styles.value}>{settings.detailEnhancement}</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.detailEnhancement}
          onChange={(e) => onSettingChange('detailEnhancement', Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Brightness
          <span className={styles.value}>{settings.brightness}</span>
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={settings.brightness}
          onChange={(e) => onSettingChange('brightness', Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Midtones
          <span className={styles.value}>{settings.midtones.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          value={settings.midtones}
          onChange={(e) => onSettingChange('midtones', Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Noise
          <span className={styles.value}>{settings.noise}</span>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={settings.noise}
          onChange={(e) => onSettingChange('noise', Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Glow
          <span className={styles.value}>{settings.glow}</span>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={settings.glow}
          onChange={(e) => onSettingChange('glow', Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={onReset} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Controls; 