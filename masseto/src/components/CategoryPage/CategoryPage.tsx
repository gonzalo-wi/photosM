import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './CategoryPage.module.css'
import Lightbox from '../Lightbox/Lightbox'
import { usePhotos } from '../../lib/photos'

/* ── Data por categoría ── */

interface Photo {
  id:      number
  src:     string
  alt:     string
  tag:     string
  year:    string
  wide?:   boolean
}

interface CategoryData {
  title:   string
  tagline: string
  photos:  Photo[]
}

const categories: Record<string, CategoryData> = {
  genero: {
    title:   'Género',
    tagline: 'Cada género tiene su propia luz, su propio silencio entre las notas.',
    photos: [
      { id: 1,  src: 'https://picsum.photos/seed/gen-rock1/800/1100', alt: 'Rock en vivo',     tag: 'Rock',         year: '2024' },
      { id: 2,  src: 'https://picsum.photos/seed/gen-elec2/900/600',  alt: 'Electrónica',      tag: 'Electrónica',  year: '2023', wide: true },
      { id: 3,  src: 'https://picsum.photos/seed/gen-jazz3/700/950',  alt: 'Jazz íntimo',      tag: 'Jazz',         year: '2024' },
      { id: 4,  src: 'https://picsum.photos/seed/gen-hh4/700/900',    alt: 'Hip-Hop',          tag: 'Hip-Hop',      year: '2023' },
      { id: 5,  src: 'https://picsum.photos/seed/gen-folk5/900/600',  alt: 'Folklórica',       tag: 'Folklórica',   year: '2022', wide: true },
      { id: 6,  src: 'https://picsum.photos/seed/gen-punk6/700/950',  alt: 'Punk underground', tag: 'Punk',         year: '2024' },
      { id: 7,  src: 'https://picsum.photos/seed/gen-reg7/800/1000',  alt: 'Reggae',           tag: 'Reggae',       year: '2023' },
      { id: 8,  src: 'https://picsum.photos/seed/gen-lat8/900/600',   alt: 'Latina',           tag: 'Latina',       year: '2024', wide: true },
    ],
  },
  lugar: {
    title:   'Lugar',
    tagline: 'El espacio define la imagen tanto como el artista que lo habita.',
    photos: [
      { id: 1,  src: 'https://picsum.photos/seed/lug-est1/900/600',  alt: 'Estadio River',       tag: 'Estadio',    year: '2024', wide: true },
      { id: 2,  src: 'https://picsum.photos/seed/lug-clb2/700/950',  alt: 'Club nocturno',       tag: 'Club',       year: '2023' },
      { id: 3,  src: 'https://picsum.photos/seed/lug-fst3/700/1000', alt: 'Festival aire libre',  tag: 'Festival',   year: '2024' },
      { id: 4,  src: 'https://picsum.photos/seed/lug-tea4/900/600',  alt: 'Teatro Colón',        tag: 'Teatro',     year: '2022', wide: true },
      { id: 5,  src: 'https://picsum.photos/seed/lug-bar5/700/950',  alt: 'Bar íntimo',          tag: 'Bar',        year: '2023' },
      { id: 6,  src: 'https://picsum.photos/seed/lug-std6/900/600',  alt: 'Estudio grabación',   tag: 'Estudio',    year: '2024', wide: true },
      { id: 7,  src: 'https://picsum.photos/seed/lug-plz7/700/900',  alt: 'Plaza al aire libre', tag: 'Exterior',   year: '2023' },
      { id: 8,  src: 'https://picsum.photos/seed/lug-azr8/800/1100', alt: 'Azotea urbana',       tag: 'Terraza',    year: '2024' },
    ],
  },
  bandas: {
    title:   'Bandas',
    tagline: 'Ensayos, backstage, shows en vivo. La identidad visual de cada proyecto.',
    photos: [
      { id: 1,  src: 'https://picsum.photos/seed/bnd-a1/700/950',   alt: 'Banda en vivo',       tag: 'En vivo',     year: '2024' },
      { id: 2,  src: 'https://picsum.photos/seed/bnd-b2/900/600',   alt: 'Backstage',           tag: 'Backstage',   year: '2023', wide: true },
      { id: 3,  src: 'https://picsum.photos/seed/bnd-c3/800/1100',  alt: 'Portrait de banda',   tag: 'Retrato',     year: '2024' },
      { id: 4,  src: 'https://picsum.photos/seed/bnd-d4/700/900',   alt: 'Ensayo',              tag: 'Ensayo',      year: '2022' },
      { id: 5,  src: 'https://picsum.photos/seed/bnd-e5/900/600',   alt: 'Sesión promo',        tag: 'Promo',       year: '2023', wide: true },
      { id: 6,  src: 'https://picsum.photos/seed/bnd-f6/700/950',   alt: 'Festival grande',     tag: 'Festival',    year: '2024' },
      { id: 7,  src: 'https://picsum.photos/seed/bnd-g7/900/600',   alt: 'Disco artwork',       tag: 'Arte disco',  year: '2023', wide: true },
      { id: 8,  src: 'https://picsum.photos/seed/bnd-h8/700/1000',  alt: 'Solista',             tag: 'Solista',     year: '2024' },
    ],
  },
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? categories[slug] : undefined
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  /* Supabase photos with fallback to hardcoded */
  const { photos: dbPhotos, connected } = usePhotos(slug || '')
  const displayPhotos = connected && dbPhotos.length > 0
    ? dbPhotos.map((p) => ({ id: p.id as unknown as number, src: p.src, alt: p.alt, tag: p.tag, year: p.year, wide: p.wide }))
    : data?.photos || []

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!data) {
    return (
      <div className={styles.notFound}>
        <h1>Categoría no encontrada</h1>
        <Link to="/" className={styles.backLink}>← Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <Link to="/" className={styles.back}>← Volver</Link>
        <div className={styles.headerContent}>
          <span className={styles.headerLabel}>CATEGORÍA</span>
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.tagline}>{data.tagline}</p>
        </div>
        <div className={styles.headerRule} aria-hidden="true" />
      </header>

      {/* Gallery grid */}
      <section className={styles.gallery}>
        {displayPhotos.map((photo) => (
          <article
            key={photo.id}
            className={`${styles.card} ${photo.wide ? styles.wide : ''}`}
            data-cursor="expand"
            onClick={() => setLightbox({ src: photo.src, alt: photo.alt })}
          >
            <div className={styles.cardInner}>
              <img
                src={photo.src}
                alt={photo.alt}
                className={styles.photo}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.overlay}>
                <span className={styles.tag}>{photo.tag}</span>
                <span className={styles.year}>{photo.year}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Bottom nav */}
      <nav className={styles.bottomNav}>
        {Object.entries(categories)
          .filter(([key]) => key !== slug)
          .map(([key, cat]) => (
            <Link to={`/${key}`} key={key} className={styles.navLink}>
              <span className={styles.navLabel}>Ver también</span>
              <span className={styles.navTitle}>{cat.title}</span>
            </Link>
          ))}
      </nav>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}
