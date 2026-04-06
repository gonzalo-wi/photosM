import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Services.module.css'

const services = [
  {
    numeral:     'I',
    name:        'Género',
    slug:        'genero',
    description:
      'Rock, electrónica, hip-hop, jazz, folklórica. Cada género tiene su energía y su luz.',
  },
  {
    numeral:     'II',
    name:        'Lugar',
    slug:        'lugar',
    description:
      'Estadios, clubes, festivales, salas íntimas. El espacio define la imagen.',
  },
  {
    numeral:     'III',
    name:        'Bandas',
    slug:        'bandas',
    description:
      'Cobertura integral de bandas y solistas. Ensayos, backstage y shows en vivo.',
  },
]

export default function Services() {
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
      className={`${styles.services} ${isVisible ? styles.visible : ''}`}
      id="services"
    >
      <div className={styles.inner}>
        {services.map((s, i) => (
          <Link to={`/${s.slug}`} key={i} className={styles.item}>
            <span className={styles.numeral}>{s.numeral}</span>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.description}>{s.description}</p>
            <span className={styles.cta}>VER GALERÍA →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
