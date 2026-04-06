import { useEffect, useRef, useState } from 'react'
import styles from './Portfolio.module.css'
import Lightbox from '../Lightbox/Lightbox'
import { usePhotos } from '../../lib/photos'

interface WorkItem {
  id:       number | string
  category: string
  year:     string
  src:      string
  alt:      string
}

const items: WorkItem[] = [
  { id: 1,  category: 'Editorial',    year: '2024', src: 'https://picsum.photos/seed/dm-ed1/640/853',  alt: 'Retrato editorial, luz natural disponible' },
  { id: 2,  category: 'Retrato',      year: '2023', src: 'https://picsum.photos/seed/dm-pt2/640/960',  alt: 'Retrato — sombra y piel, estudio' },
  { id: 3,  category: 'Moda',         year: '2024', src: 'https://picsum.photos/seed/dm-fw3/640/800',  alt: 'Editorial de moda — serie crepúsculo' },
  { id: 4,  category: 'Paisaje',      year: '2022', src: 'https://picsum.photos/seed/dm-ls4/900/600',  alt: 'Paisaje — Patagonia, hora dorada' },
  { id: 5,  category: 'Comercial',    year: '2023', src: 'https://picsum.photos/seed/dm-cm5/640/853',  alt: 'Campaña comercial — fragancia de lujo' },
  { id: 6,  category: 'Conceptual',   year: '2024', src: 'https://picsum.photos/seed/dm-cx6/640/960',  alt: 'Arte conceptual — serie memoria' },
  { id: 7,  category: 'Editorial',    year: '2023', src: 'https://picsum.photos/seed/dm-ed7/700/700',  alt: 'Editorial — formato cuadrado, tapa de revista' },
  { id: 8,  category: 'Retrato',      year: '2024', src: 'https://picsum.photos/seed/dm-pt8/640/960',  alt: 'Retrato — luz disponible, 2024' },
  { id: 9,  category: 'Documental',   year: '2022', src: 'https://picsum.photos/seed/dm-dc9/640/800',  alt: 'Documental — vida nocturna, Buenos Aires' },
  { id: 10, category: 'Arquitectura', year: '2023', src: 'https://picsum.photos/seed/dm-ar10/800/534', alt: 'Arquitectura — espacios vacíos, luz cenital' },
  { id: 11, category: 'Moda',         year: '2024', src: 'https://picsum.photos/seed/dm-fw11/640/960', alt: 'Moda — colección invierno, serie texturas' },
  { id: 12, category: 'Naturaleza',   year: '2022', src: 'https://picsum.photos/seed/dm-nt12/640/800', alt: 'Naturaleza — Patagonia, niebla matinal' },
]

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  /* Use Supabase photos if connected, otherwise fallback to hardcoded */
  const { photos: dbPhotos, connected } = usePhotos('portfolio')
  const displayItems: WorkItem[] = connected && dbPhotos.length > 0
    ? dbPhotos.map((p) => ({ id: p.id, category: p.tag, year: p.year, src: p.src, alt: p.alt }))
    : items

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
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.portfolio} ${isVisible ? styles.visible : ''}`}
      id="work"
    >
      {/* Section header: "01" watermark + "WORK" label */}
      <div className={styles.sectionHeader}>
        <span className={styles.number} aria-hidden="true">01</span>
        <div className={styles.headerText}>
          <h2 className={styles.sectionTitle}>OBRA</h2>
          <span className={styles.sectionSub}>Proyectos seleccionados — 2019–2024</span>
        </div>
      </div>

      {/* Masonry grid */}
      <div className={styles.grid}>
        {displayItems.map((item) => (
          <article
            key={item.id}
            className={styles.item}
            data-cursor="expand"
            onClick={() => setLightbox({ src: item.src, alt: item.alt })}
          >
            <div className={styles.itemInner}>
              <img
                src={item.src}
                alt={item.alt}
                className={styles.photo}
                loading="lazy"
              />
              <div className={styles.itemLabel}>
                <span className={styles.labelCategory}>{item.category}</span>
                <span className={styles.labelYear}>{item.year}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </section>
  )
}
