import { createClient } from '@supabase/supabase-js'

// Service-role kalit RLS qoidalarini chetlab o'tadi — shuning uchun bu
// fayl HECH QACHON frontendga import qilinmaydi, faqat server/ ichida.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
