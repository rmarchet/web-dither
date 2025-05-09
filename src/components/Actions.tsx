import styles from '../styles/ImagePreview.module.css';

interface ActionsProps {
  onChangeImage: () => void;
  onExport: () => void;
  onClearImage: () => void;
}

export const Actions = ({
  onChangeImage,
  onExport,
  onClearImage,
}: ActionsProps) => {
  return (
    <div className={styles.imageButtons}>
      <button onClick={onChangeImage} className={styles.changeImageButton}>
        Load Image
      </button>
      <button onClick={onExport} className={styles.exportButton}>
        Save
      </button>
      <button onClick={onClearImage} className={styles.clearButton}>
        Clear Image
      </button>
    </div>
  );
};
