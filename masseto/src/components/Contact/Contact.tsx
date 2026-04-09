import { useEffect, useRef, useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={sectionRef}
      className={`${styles.contact} ${isVisible ? styles.visible : ''}`}
      id="contact"
    >      {/* ── Top section ── */}
      <div className={styles.top}>
        <span className={styles.label}>Contacto</span>
        <div className={styles.line} aria-hidden="true" />
      </div>

      {/* ── Main content ── */}
      <div className={styles.inner}>
        <div className={styles.left}>
          <h2 className={styles.heading}>
            Trabajemos<br />juntos
          </h2>
          <p className={styles.subtitle}>
            ¿Tenés un proyecto, una banda o un evento?<br />
            Escribime y creamos algo único.
          </p>
          <a href="mailto:dmasettophoto@gmail.com" className={styles.emailBtn}>
            <span className={styles.emailIcon}>✉</span>
            dmasettophoto@gmail.com
          </a>
        </div>

        <div className={styles.right}>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Ubicación</span>
            <span className={styles.infoValue}>Buenos Aires, Argentina</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Redes</span>
            <nav className={styles.social} aria-label="Redes sociales">
              <a href="https://www.facebook.com/profile.php?id=61550112402815" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
            </nav>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Disponibilidad</span>
            <span className={styles.availBadge}>
              <span className={styles.availDot} />
              Disponible para proyectos
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.meta}>
        <span className={styles.copyright}>
          © {new Date().getFullYear()} Daniel Masetto
        </span>
        <span className={styles.metaRight}>
          masetto.com.ar · Buenos Aires
        </span>
      </div>
    </footer>
  )
}
