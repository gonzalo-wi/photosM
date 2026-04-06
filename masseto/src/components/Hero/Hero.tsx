import bannerVideo from '../../assets/banner.mp4'
import styles from './Hero.module.css'

export default function Hero() {
  const scrollDown = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero}>
      {/* Background video */}
      <video
        className={styles.video}
        src={bannerVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Dark overlay on top of video */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Animated film grain overlay */}
      <div className={styles.grain} aria-hidden="true" />

      {/* Radial vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Central name block */}
      <div className={styles.content}>
        <div className={styles.nameBlock}>
          <span className={`${styles.nameLine} ${styles.animate0}`}>
            DANIEL
          </span>
          <em className={`${styles.nameItalic} ${styles.animate200}`}>
            arte fino
          </em>
          <span className={`${styles.nameLine} ${styles.animate400}`}>
            MASETTO
          </span>
        </div>

        {/* Horizontal rule — draws left→right on load */}
        <div className={`${styles.rule} ${styles.animate600}`} aria-hidden="true" />
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} onClick={scrollDown} role="button" aria-label="Ir al contenido">
        <span className={styles.scrollLabel}>bajar</span>
        <div className={styles.scrollTrack}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </section>
  )
}
