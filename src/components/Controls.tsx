import React from 'react';
import cn from 'classnames';
import { DITHER_STYLES, SCALED_STYLES, DITHER_OPTIONS } from '../utils/controlOptions';
import { ModulatedDiffuseControls } from './Controls/ModulatedDiffuseControls';
import { DitherSettings, DitherStyle } from '../types';
import styles from '../styles/Controls.module.css';

interface ControlsProps {
  settings: DitherSettings;
  onSettingChange: (setting: keyof DitherSettings, value: number | string) => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  settings,
  onSettingChange,
  onReset
}) => {
  return (
    <div className={styles.controls}>
      <div className={cn(styles.controlGroup, styles.styleGroup)}>
        <label htmlFor="style-select" className={styles.controlLabel}>Style:</label>
        <select
          id="style-select"
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

      {SCALED_STYLES.includes(settings.style) && (
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Dithering Scale
            <span className={styles.value}>{settings.ditheringScale}</span>
          </label>
          <input
            type="range"
            min="1"
            max="15"
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
      {(settings.style !== 'Modulated Diffuse Y' && settings.style !== 'Modulated Diffuse X') && (
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
      )}

    
    {(settings.style === 'AAAAAA') && ( // temporarily disabled 
      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Luminance Threshold
          <span className={styles.value}>{settings.luminanceThreshold}</span>
        </label>
        <input
          type="range"
          min="0"
          max="255"
          value={settings.luminanceThreshold}
          onChange={(e) => onSettingChange('luminanceThreshold', Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      )}

    <div className={styles.controlGroup}>
      <label className={styles.controlLabel}>
        Blur
        <span className={styles.value}>{settings.blur}</span>
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={settings.blur}
        onChange={(e) => onSettingChange('blur', Number(e.target.value))}
        className={styles.slider}
      />
    </div>

      {/* Show these sliders only for Modulated Diffuse Y or Modulated Diffuse X style */}
      {(settings.style === 'Modulated Diffuse Y' 
      || settings.style === 'Modulated Diffuse X'
      || settings.style === 'Composite Video'
      || settings.style === 'Fractalify'
      || settings.style === 'Joy Plot'
      || settings.style === 'Rutt-Etra'
      || settings.style === 'CRT'
      || settings.style === 'LZ77'
      || settings.style === 'Reeded Glass'
      || settings.style === 'Waveform'
      || settings.style === 'Waveform Alt'
      || settings.style === 'Anaglyph'
    ) && (
        <ModulatedDiffuseControls settings={settings} onSettingChange={onSettingChange} />
      )}

      <div className={cn(styles.controlGroup, styles.checkboxGroup)}>
        <label className={styles.controlLabel}>
          <input
            type="checkbox"
            checked={settings.invert}
            onChange={e => onSettingChange('invert', e.target.checked)}
            className={styles.checkbox}
          />
          Invert
        </label>
      </div>

      <div className={cn(styles.controlGroup, styles.checkboxGroup)}>
        <label className={styles.controlLabel}>
          <input
            type="checkbox"
            checked={settings.grayscale}
            onChange={e => onSettingChange('grayscale', e.target.checked)}
            className={styles.checkbox}
          />
          Force grayscale
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={onReset} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
};
