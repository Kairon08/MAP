import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Bu klient faqat public (anon) kalit bilan ishlaydi — RLS qoidalari
// supabase/schema.sql faylida shu klient uchun xavfsizlikni ta'minlaydi.
// Service-role kalit HECH QACHON frontendga chiqarilmaydi, u faqat
// server/server.js ichida ishlatiladi.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchHotelsByCity(citySlug) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*, reviews(id, rating)')
    .eq('city_slug', citySlug)
  if (error) throw error
  return data
}

export async function fetchHotelWithReviews(hotelId) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*, reviews(*)')
    .eq('id', hotelId)
    .single()
  if (error) throw error
  return data
}
