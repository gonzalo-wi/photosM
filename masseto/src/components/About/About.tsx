import { useEffect, useRef, useState } from 'react'
import styles from './About.module.css'

export default function About() {
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
    <section
      ref={sectionRef}
      className={`${styles.about} ${isVisible ? styles.visible : ''}`}
      id="about"
    >
      <div className={styles.inner}>
        {/* Left — large pull quote */}
        <div className={styles.left}>
          <blockquote className={styles.pullQuote}>
            "La luz es el único<br />idioma que conozco."
          </blockquote>
        </div>

        {/* Thin gold vertical divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Right — body text, offset downward */}
        <div className={styles.right}>
          <p>
            Más de quince años en la búsqueda de momentos que resisten ser
            nombrados — la pausa entre el gesto y la quietud, la calidad de
            la luz justo antes de que abandone una superficie. Cada cuadro
            es un acto de atención.
          </p>
          <p>
            Trabajando en plataformas editoriales, de arte y comerciales,
            la práctica se sostiene en una sola convicción: la fotografía no
            es documentación sino traducción — del mundo visto a algo sentido.
          </p>
        </div>
      </div>
    </section>
  )
}
