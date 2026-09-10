import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import paymentsRouter from './routes/payments.js'
import { supabaseAdmin } from './supabaseAdmin.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())

// Stripe webhook imzosini tekshirish uchun RAW body kerak — shuning uchun
// bu bitta yo'l global express.json() dan OLDIN alohida ro'yxatdan o'tkaziladi.
app.use('/api/payments/stripe', express.raw({ type: 'application/json' }))

// Qolgan barcha yo'llar uchun oddiy JSON parser
app.use(express.json())

app.use('/api/payments', paymentsRouter)

// ---- Bookings: rezervatsiya yaratish (to'lovdan oldingi bosqich) ----
app.post('/api/bookings', async (req, res) => {
  const { hotelId, userId, guestName, guestEmail, checkIn, checkOut, totalPrice } = req.body

  if (!hotelId || !guestName || !guestEmail || !checkIn || !checkOut || !totalPrice) {
    return res.status(400).json({ error: 'Missing required booking fields' })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      hotel_id: hotelId,
      user_id: userId || null,
      guest_name: guestName,
      guest_email: guestEmail,
      check_in: checkIn,
      check_out: checkOut,
      total_price: totalPrice,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ booking: data })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'voyage-payments-server' })
})

app.listen(PORT, () => {
  console.log(`Voyage payments server running on port ${PORT}`)
})
