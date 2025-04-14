import React from 'react';
import styles from '../App.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Dither - Apply amazing dithering effect for any images</h1>
    </div>
  );
};

export default Header; 