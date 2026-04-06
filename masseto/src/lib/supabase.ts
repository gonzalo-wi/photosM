import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Si no hay credenciales de Supabase configuradas, `supabase` será null.
 * Los componentes deben usar los datos hardcodeados como fallback.
 */
export const supabase =
  supabaseUrl && supabaseAnon
    ? createClient(supabaseUrl, supabaseAnon)
    : null

/** Nombre del bucket en Supabase Storage */
export const BUCKET = 'photos'
