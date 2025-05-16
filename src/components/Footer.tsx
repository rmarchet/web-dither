import styles from '../styles/Footer.module.css'

export const Footer = () => {
  const logo = 'logo.svg'

  return (
    <footer className={styles.logoContainer}>
      <img src={logo} alt="D!TR" />
      <p>D!TR - Dithering for the rest of us</p>
    </footer>
  )
}
