import { useEffect, useState } from 'react'
import { supabase, BUCKET } from '../lib/supabase'

/* ── Types ── */

export interface Photo {
  id:        string
  src:       string
  alt:       string
  category:  string   // 'portfolio' | 'genero' | 'lugar' | 'bandas'
  tag:       string
  year:      string
  wide:      boolean
  position:  number
}

/* ── Hook: fetch photos by category ── */

export function usePhotos(category: string) {
  const [photos, setPhotos]   = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      const { data, error } = await supabase!
        .from('photos')
        .select('*')
        .eq('category', category)
        .order('position', { ascending: true })

      if (!cancelled && !error && data) {
        setPhotos(
          data.map((row) => ({
            id:       row.id,
            src:      supabase!.storage.from(BUCKET).getPublicUrl(row.file_path).data.publicUrl,
            alt:      row.alt   || '',
            category: row.category,
            tag:      row.tag   || '',
            year:     row.year  || '',
            wide:     row.wide  ?? false,
            position: row.position ?? 0,
          }))
        )
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [category])

  return { photos, loading, connected: !!supabase }
}

/* ── Admin helpers ── */

export async function uploadPhoto(
  file: File,
  meta: { category: string; tag: string; year: string; alt: string; wide: boolean }
) {
  if (!supabase) throw new Error('Supabase no configurado')

  const ext      = file.name.split('.').pop() || 'jpg'
  const filePath = `${meta.category}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  // Upload file
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { contentType: file.type })

  if (uploadErr) throw uploadErr

  // Get max position
  const { data: last } = await supabase
    .from('photos')
    .select('position')
    .eq('category', meta.category)
    .order('position', { ascending: false })
    .limit(1)

  const nextPos = (last?.[0]?.position ?? 0) + 1

  // Insert row
  const { error: insertErr } = await supabase
    .from('photos')
    .insert({
      file_path: filePath,
      category:  meta.category,
      tag:       meta.tag,
      year:      meta.year,
      alt:       meta.alt,
      wide:      meta.wide,
      position:  nextPos,
    })

  if (insertErr) throw insertErr
}

export async function deletePhoto(id: string, filePath: string) {
  if (!supabase) throw new Error('Supabase no configurado')

  await supabase.storage.from(BUCKET).remove([filePath])
  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) throw error
}

export async function fetchAllPhotos() {
  if (!supabase) return []
  const { data } = await supabase
    .from('photos')
    .select('*')
    .order('category')
    .order('position', { ascending: true })

  if (!data) return []

  return data.map((row) => ({
    id:        row.id       as string,
    file_path: row.file_path as string,
    src:       supabase!.storage.from(BUCKET).getPublicUrl(row.file_path).data.publicUrl,
    alt:       (row.alt  || '') as string,
    category:  row.category as string,
    tag:       (row.tag  || '') as string,
    year:      (row.year || '') as string,
    wide:      (row.wide ?? false) as boolean,
    position:  (row.position ?? 0) as number,
  }))
}
