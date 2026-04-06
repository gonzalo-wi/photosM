import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const cursorRef   = useRef<HTMLDivElement>(null)
  const isExpanded  = useRef(false)
  const rafRef      = useRef<number | null>(null)
  const pos         = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      const shouldExpand = !!target.closest('[data-cursor="expand"]')
      if (shouldExpand !== isExpanded.current) {
        isExpanded.current = shouldExpand
        cursorRef.current?.classList.toggle(styles.expanded, shouldExpand)
      }
    }

    const tick = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`
        cursorRef.current.style.top  = `${pos.current.y}px`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.body.setAttribute('data-custom-cursor', '')
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.body.removeAttribute('data-custom-cursor')
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />
}
