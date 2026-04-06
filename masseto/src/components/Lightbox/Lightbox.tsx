import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Lightbox.module.css'

interface LightboxProps {
  src:     string
  alt:     string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-label={alt}>
      <button className={styles.close} onClick={onClose} aria-label="Cerrar">×</button>
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  )
}
