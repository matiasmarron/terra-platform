import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, CONSULTATION_PRICE_USD_CENTS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { date, notes } = body

  if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await getStripe().checkout.sessions.create({
    mode:          'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency:     'usd',
        unit_amount:  CONSULTATION_PRICE_USD_CENTS,
        product_data: {
          name:        'Consulta Terra — 60 min',
          description: `Sesión individual el ${new Date(date).toLocaleDateString('es-AR')}`,
        },
      },
      quantity: 1,
    }],
    metadata: {
      user_id: user.id,
      date,
      notes:   notes ?? '',
      type:    'consultation',
    },
    success_url: `${appUrl}/consultations/confirmada?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/consultations/nueva`,
  })

  return NextResponse.json({ url: session.url })
}
