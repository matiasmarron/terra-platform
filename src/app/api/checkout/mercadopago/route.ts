import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getMpPreference, CONSULTATION_PRICE_ARS } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { date, notes } = body

  if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const preference = await getMpPreference().create({
    body: {
      items: [{
        id:          'consultation',
        title:       'Consulta Terra — 60 min',
        description: `Sesión individual el ${new Date(date).toLocaleDateString('es-AR')}`,
        quantity:    1,
        unit_price:  CONSULTATION_PRICE_ARS,
        currency_id: 'ARS',
      }],
      metadata: {
        user_id: user.id,
        date,
        notes:   notes ?? '',
        type:    'consultation',
      },
      back_urls: {
        success: `${appUrl}/consultations/confirmada`,
        failure: `${appUrl}/consultations/nueva?error=pago_fallido`,
        pending: `${appUrl}/consultations/confirmada`,
      },
      auto_return:         'approved',
      notification_url:    `${appUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'Terra',
    },
  })

  return NextResponse.json({ url: preference.init_point })
}
