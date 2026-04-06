import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadPhoto, deletePhoto, fetchAllPhotos } from '../../lib/photos'
import styles from './Admin.module.css'

type PhotoRow = {
  id: string; file_path: string; src: string; alt: string
  category: string; tag: string; year: string; wide: boolean; position: number
}

const CATEGORIES = [
  { value: 'portfolio', label: 'Portfolio (Home)' },
  { value: 'genero',    label: 'Género' },
  { value: 'lugar',     label: 'Lugar' },
  { value: 'bandas',    label: 'Bandas' },
]

type Tab = 'upload' | 'gallery'

export default function Admin() {
  const navigate = useNavigate()

  /* ── Auth state ── */
  const [session, setSession] = useState<boolean>(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  /* ── Photos state ── */
  const [photos, setPhotos]     = useState<PhotoRow[]>([])
  const [loading, setLoading]   = useState(false)
  const [filter, setFilter]     = useState('all')

  /* ── Upload state ── */
  const [uploading, setUploading]   = useState(false)
  const [uploadMsg, setUploadMsg]   = useState('')
  const [dragOver, setDragOver]     = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    category: 'portfolio', tag: '', year: new Date().getFullYear().toString(), alt: '', wide: false,
  })

  /* ── Preview state ── */
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previews, setPreviews]         = useState<string[]>([])

  /* ── UI state ── */
  const [tab, setTab]             = useState<Tab>('upload')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* ── Auth check ── */
  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(!!s)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s)
    })

    return () => subscription.unsubscribe()
  }, [])

  /* ── Load photos ── */
  const loadPhotos = useCallback(async () => {
    setLoading(true)
    const data = await fetchAllPhotos()
    setPhotos(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) loadPhotos()
  }, [session, loadPhotos])

  /* ── Check if Supabase is configured (after hooks) ── */
  if (!supabase) {
    return (
      <div className={styles.page}>
        <div className={styles.noConfig}>
          <h1>Supabase no configurado</h1>
          <p>
            Creá un archivo <code>.env</code> en la raíz del proyecto con:
          </p>
          <pre>{`VITE_SUPABASE_URL=https://tu-proyecto.supabase.co\nVITE_SUPABASE_ANON_KEY=tu-anon-key`}</pre>
          <p>Reiniciá el servidor de desarrollo después de crearlo.</p>
        </div>
      </div>
    )
  }

  /* ── Login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }

  /* ── Logout ── */
  const handleLogout = () => {
    supabase!.auth.signOut()
    setSession(false)
  }

  /* ── Stage files for preview (don't upload yet) ── */
  const stageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const arr = Array.from(files)
    setPendingFiles(arr)
    setPreviews(arr.map((f) => URL.createObjectURL(f)))
    setUploadMsg('')
  }

  /* ── Confirm upload ── */
  const confirmUpload = async () => {
    if (pendingFiles.length === 0) return
    setUploading(true)
    setUploadMsg('')

    let success = 0
    for (const file of pendingFiles) {
      try {
        await uploadPhoto(file, form)
        success++
      } catch (err) {
        setUploadMsg(`Error: ${(err as Error).message}`)
      }
    }

    if (success > 0) {
      setUploadMsg(`${success} foto${success > 1 ? 's' : ''} subida${success > 1 ? 's' : ''} ✓`)
      await loadPhotos()
    }
    setUploading(false)
    cancelPreview()
  }

  /* ── Cancel preview ── */
  const cancelPreview = () => {
    previews.forEach((url) => URL.revokeObjectURL(url))
    setPendingFiles([])
    setPreviews([])
    if (fileRef.current) fileRef.current.value = ''
  }

  /* ── Remove one file from preview ── */
  const removePreview = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  /* ── Delete ── */
  const handleDelete = async (photo: PhotoRow) => {
    if (!confirm(`¿Eliminar esta foto? (${photo.tag || photo.alt})`)) return
    try {
      await deletePhoto(photo.id, photo.file_path)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    } catch (err) {
      alert(`Error al eliminar: ${(err as Error).message}`)
    }
  }

  /* ── Drop zone ── */
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    stageFiles(e.dataTransfer.files)
  }

  /* ── Filtered photos ── */
  const displayed = filter === 'all' ? photos : photos.filter((p) => p.category === filter)

  /* ── Auth loading ── */
  if (authLoading) {
    return <div className={styles.page}><p className={styles.loadingText}>Cargando...</p></div>
  }

  /* ═══════════════════════
     LOGIN SCREEN
     ═══════════════════════ */
  if (!session) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <span className={styles.loginBrand}>MASETTO</span>
          <div className={styles.loginDivider} />
          <span className={styles.loginSub}>Panel de administración</span>

          <form className={styles.loginForm} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                className={styles.loginInput}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className={styles.inputIcon}>✉</span>
            </div>

            <div className={styles.inputGroup}>
              <input
                className={styles.loginInput}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className={styles.inputIcon}>⚿</span>
            </div>

            {authError && <p className={styles.error}>{authError}</p>}

            <button className={styles.loginBtn} type="submit">Ingresar</button>
          </form>

          <p className={styles.loginFooter}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>← Volver al sitio</a>
          </p>
        </div>
      </div>
    )
  }

  /* ═══════════════════════
     ADMIN DASHBOARD
     ═══════════════════════ */
  return (
    <div className={styles.layout}>
      {/* ── Overlay for mobile sidebar ── */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <h1 className={styles.sidebarBrand}>MASETTO</h1>
        <p className={styles.sidebarTag}>Admin Panel</p>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.sidebarLink} ${tab === 'upload' ? styles.sidebarLinkActive : ''}`}
            onClick={() => { setTab('upload'); setSidebarOpen(false) }}
          >
            <span className={styles.sidebarIcon}>⬆</span>
            Subir fotos
          </button>

          <button
            className={`${styles.sidebarLink} ${tab === 'gallery' ? styles.sidebarLinkActive : ''}`}
            onClick={() => { setTab('gallery'); setSidebarOpen(false) }}
          >
            <span className={styles.sidebarIcon}>◫</span>
            Galería
          </button>

          <button
            className={styles.sidebarLink}
            onClick={() => navigate('/')}
          >
            <span className={styles.sidebarIcon}>↗</span>
            Ver sitio
          </button>
        </nav>

        <div className={styles.sidebarSpacer} />

        <div className={styles.sidebarBottom}>
          <button className={styles.sidebarLogout} onClick={handleLogout}>
            <span className={styles.sidebarIcon}>⏻</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(true)}>☰</button>
            <h2 className={styles.topTitle}>
              {tab === 'upload' ? 'Subir fotos' : 'Galería'}
            </h2>
          </div>
          <div className={styles.topStats}>
            <span className={styles.stat}>
              Total: <strong className={styles.statNum}>{photos.length}</strong>
            </span>
            {CATEGORIES.map((c) => (
              <span key={c.value} className={styles.stat}>
                {c.label.split(' ')[0]}: <strong className={styles.statNum}>{photos.filter(p => p.category === c.value).length}</strong>
              </span>
            ))}
          </div>
        </header>

        <div className={styles.content}>
          {/* ── UPLOAD TAB ── */}
          {tab === 'upload' && (
            <section className={styles.uploadSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Nueva foto</h2>
              </div>

              <div className={styles.uploadForm}>
                <div className={styles.fieldRow}>
                  <label className={styles.label}>
                    Categoría
                    <select
                      className={styles.select}
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.label}>
                    Tag
                    <input
                      className={styles.input}
                      value={form.tag}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                      placeholder="Ej: Rock, Backstage..."
                    />
                  </label>

                  <label className={styles.label}>
                    Año
                    <input
                      className={styles.input}
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="2024"
                    />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.label} style={{ flex: 1 }}>
                    Descripción (alt)
                    <input
                      className={styles.input}
                      value={form.alt}
                      onChange={(e) => setForm({ ...form, alt: e.target.value })}
                      placeholder="Descripción de la foto"
                    />
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.wide}
                      onChange={(e) => setForm({ ...form, wide: e.target.checked })}
                    />
                    Ancho doble
                  </label>
                </div>

                {/* Drop zone — only when no preview */}
                {previews.length === 0 && (
                  <div
                    className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => stageFiles(e.target.files)}
                    />
                    <span className={styles.dropIcon}>📷</span>
                    <span className={styles.dropText}>Arrastrá una foto acá o hacé click para seleccionar</span>
                    <p className={styles.dropHint}>JPG, PNG, WebP · Máximo 10 MB</p>
                  </div>
                )}

                {/* Single centered preview */}
                {previews.length > 0 && (
                  <div className={styles.previewSection}>
                    <div className={styles.previewCenter}>
                      <img src={previews[0]} alt="Preview" className={styles.previewImgLarge} />
                    </div>
                    <p className={styles.previewName}>{pendingFiles[0]?.name}</p>
                    <div className={styles.previewActions}>
                      <button className={styles.previewCancel} onClick={cancelPreview}>
                        Cancelar
                      </button>
                      <button
                        className={styles.previewConfirm}
                        onClick={confirmUpload}
                        disabled={uploading}
                      >
                        {uploading ? 'Subiendo...' : 'Subir foto'}
                      </button>
                    </div>
                  </div>
                )}

                {uploadMsg && <p className={styles.uploadMsg}>{uploadMsg}</p>}
              </div>
            </section>
          )}

          {/* ── GALLERY TAB ── */}
          {tab === 'gallery' && (
            <section className={styles.gallerySection}>
              <div className={styles.galleryHeader}>
                <h2 className={styles.sectionTitle}>
                  Fotos ({displayed.length})
                </h2>
                <div className={styles.filters}>
                  <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      className={`${styles.filterBtn} ${filter === c.value ? styles.filterActive : ''}`}
                      onClick={() => setFilter(c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <p className={styles.loadingText}>Cargando fotos...</p>
              ) : displayed.length === 0 ? (
                <p className={styles.emptyText}>No hay fotos en esta categoría.</p>
              ) : (
                <div className={styles.grid}>
                  {displayed.map((photo) => (
                    <div key={photo.id} className={styles.card}>
                      <img src={photo.src} alt={photo.alt} className={styles.thumb} loading="lazy" />
                      <div className={styles.cardInfo}>
                        <span className={styles.cardTag}>{photo.tag || '—'}</span>
                        <span className={styles.cardMeta}>
                          {photo.category} · {photo.year} {photo.wide ? '· ancho' : ''}
                        </span>
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(photo)}
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
