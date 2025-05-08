import styles from '../../styles/Controls.module.css';
import { DitherSettings } from '../../types';

interface ModulatedDiffuseControlsProps {
  settings: DitherSettings;
  onSettingChange: (setting: keyof DitherSettings, value: number) => void;
}

export const ModulatedDiffuseControls = ({
  settings,
  onSettingChange
}: ModulatedDiffuseControlsProps) => {
  return (
    <>
      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Amplitude
          <span className={styles.value}>{settings.amplitude}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.01"
          value={settings.amplitude}
          onChange={(e) => onSettingChange('amplitude', Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Frequency
          <span className={styles.value}>{settings.frequency}</span>
        </label>
        <input
          type="range"
          min="0.005"
          max="0.5"
          step="0.005"
          value={settings.frequency}
          onChange={(e) => onSettingChange('frequency', Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.controlGroup}>
        <label className={styles.controlLabel}>
          Phase
          <span className={styles.value}>{settings.phase}</span>
        </label>
        <input
          type="range"
          min="0"
          max={String(2 * Math.PI)}
          step="0.01"
          value={settings.phase}
          onChange={(e) => onSettingChange('phase', Number(e.target.value))}
          className={styles.slider}
        />
      </div>
    </>
  );
};
