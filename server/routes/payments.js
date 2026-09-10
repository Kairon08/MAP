import { Router } from 'express'
import crypto from 'crypto'
import Stripe from 'stripe'
import { supabaseAdmin } from '../supabaseAdmin.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function recordPayment({ bookingId, provider, amount, currency, status, providerTxId, rawPayload }) {
  await supabaseAdmin.from('payments').insert({
    booking_id: bookingId,
    provider,
    amount,
    currency,
    status,
    provider_transaction_id: providerTxId,
    raw_payload: rawPayload,
  })
  if (status === 'paid') {
    await supabaseAdmin.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId)
  }
}

// =========================================================
// CLICK.UZ — prepare/complete webhook
// Docs pattern: https://docs.click.uz (merchant API)
// =========================================================
router.post('/click', async (req, res) => {
  const { click_trans_id, merchant_trans_id, amount, action, sign_time, sign_string } = req.body

  const expectedSign = crypto
    .createHash('md5')
    .update(`${click_trans_id}${req.body.service_id}${process.env.CLICK_SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`)
    .digest('hex')

  if (expectedSign !== sign_string) {
    return res.json({ error: -1, error_note: 'Invalid signature' })
  }

  // action: 0 = Prepare, 1 = Complete
  if (Number(action) === 0) {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_prepare_id: merchant_trans_id,
      error: 0,
      error_note: 'Success',
    })
  }

  await recordPayment({
    bookingId: merchant_trans_id,
    provider: 'click',
    amount,
    currency: 'UZS',
    status: 'paid',
    providerTxId: click_trans_id,
    rawPayload: req.body,
  })

  return res.json({
    click_trans_id,
    merchant_trans_id,
    merchant_confirm_id: merchant_trans_id,
    error: 0,
    error_note: 'Success',
  })
})

// =========================================================
// PAYME — JSON-RPC style merchant API
// Docs pattern: https://developer.help.paycom.uz
// =========================================================
router.post('/payme', async (req, res) => {
  const authHeader = req.headers.authorization || ''
  const expected = 'Basic ' + Buffer.from(`Paycom:${process.env.PAYME_SECRET_KEY}`).toString('base64')
  if (authHeader !== expected) {
    return res.json({ error: { code: -32504, message: 'Unauthorized' } })
  }

  const { method, params, id } = req.body

  switch (method) {
    case 'CheckPerformTransaction': {
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('id, total_price')
        .eq('id', params.account.booking_id)
        .single()
      if (!booking) return res.json({ error: { code: -31050, message: 'Booking not found' }, id })
      return res.json({ result: { allow: true }, id })
    }

    case 'CreateTransaction': {
      await recordPayment({
        bookingId: params.account.booking_id,
        provider: 'payme',
        amount: params.amount / 100, // tiyin -> so'm
        currency: 'UZS',
        status: 'pending',
        providerTxId: params.id,
        rawPayload: req.body,
      })
      return res.json({ result: { create_time: Date.now(), transaction: params.id, state: 1 }, id })
    }

    case 'PerformTransaction': {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'paid' })
        .eq('provider_transaction_id', params.id)
      await supabaseAdmin
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', req.body.params.account?.booking_id)
      return res.json({ result: { perform_time: Date.now(), transaction: params.id, state: 2 }, id })
    }

    case 'CancelTransaction': {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'refunded' })
        .eq('provider_transaction_id', params.id)
      return res.json({ result: { cancel_time: Date.now(), transaction: params.id, state: -1 }, id })
    }

    default:
      return res.json({ error: { code: -32601, message: 'Method not found' }, id })
  }
})

// =========================================================
// STRIPE — webhook (raw body required, see server.js middleware)
// =========================================================
router.post('/stripe', async (req, res) => {
  const signature = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    await recordPayment({
      bookingId: session.metadata.booking_id,
      provider: 'stripe',
      amount: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
      status: 'paid',
      providerTxId: session.payment_intent,
      rawPayload: session,
    })
  }

  res.json({ received: true })
})

// Stripe Checkout session yaratish (frontend "Book & Pay" tugmasi shu endpoint'ni chaqiradi)
router.post('/stripe/create-checkout-session', async (req, res) => {
  const { bookingId, amount, currency, hotelName, successUrl, cancelUrl } = req.body
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: currency || 'usd',
          product_data: { name: hotelName },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      metadata: { booking_id: bookingId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
