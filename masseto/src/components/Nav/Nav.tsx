import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'

const links = [
  { label: 'Obra',      hash: '#work'     },
  { label: 'Servicios', hash: '#services' },
  { label: 'Acerca',    hash: '#about'    },
  { label: 'Contacto',  hash: '#contact'  },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Close menu on Escape */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const goTo = useCallback((e: React.MouseEvent, hash: string) => {
    e.preventDefault()
    setMenuOpen(false)

    const scrollToEl = () => {
      const el = hash === '#' ? null : document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (pathname !== '/') {
      navigate('/')
      /* Wait for home page to mount then scroll */
      requestAnimationFrame(() => setTimeout(scrollToEl, 100))
    } else {
      scrollToEl()
    }
  }, [navigate, pathname])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
      <a
        href="/"
        className={styles.brand}
        onClick={(e) => goTo(e, '#')}
        data-cursor="expand"
      >
        MASETTO
      </a>

      {/* Desktop nav links */}
      <nav aria-label="Navegación principal" className={styles.desktopNav}>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.hash}>
              <a
                href={`/${link.hash}`}
                className={styles.link}
                onClick={(e) => goTo(e, link.hash)}
                data-cursor="expand"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        aria-expanded={menuOpen}
        aria-controls="main-nav"
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {/* Mobile menu overlay — rendered via portal to avoid stacking issues */}
      {createPortal(
        <nav
          id="main-nav"
          className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
          aria-label="Menú móvil"
          aria-hidden={!menuOpen}
        >
          <ul className={styles.mobileLinks}>
            {links.map((link) => (
              <li key={link.hash}>
                <a
                  href={`/${link.hash}`}
                  className={styles.mobileLink}
                  onClick={(e) => goTo(e, link.hash)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>,
        document.body
      )}
    </header>
  )
}
