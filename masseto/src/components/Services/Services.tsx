import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Services.module.css'

import card1 from '../../assets/cards/card1.jpg'
import card2 from '../../assets/cards/card2.jpg'
import card3 from '../../assets/cards/card3.jpg'

const services = [
  {
    numeral:     'I',
    name:        'Género',
    slug:        'genero',
    description:
      'Rock, electrónica, hip-hop, jazz, folklórica. Cada género tiene su energía y su luz.',
    preview:     card1,
    previewAlt:  'Fotografía musical — Rock en vivo',
  },
  {
    numeral:     'II',
    name:        'Lugar',
    slug:        'lugar',
    description:
      'Estadios, clubes, festivales, salas íntimas. El espacio define la imagen.',
    preview:     card2,
    previewAlt:  'Fotografía de festival — escenario principal',
  },
  {
    numeral:     'III',
    name:        'Bandas',
    slug:        'bandas',
    description:
      'Cobertura integral de bandas y solistas. Ensayos, backstage y shows en vivo.',
    preview:     card3,
    previewAlt:  'Banda en vivo — backstage y escenario',
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

            {/* Preview image */}
            <div className={styles.preview}>
              <img
                src={s.preview}
                alt={s.previewAlt}
                className={styles.previewImg}
                loading="lazy"
                decoding="async"
              />
            </div>

            <p className={styles.description}>{s.description}</p>
            <span className={styles.cta}>VER GALERÍA →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
