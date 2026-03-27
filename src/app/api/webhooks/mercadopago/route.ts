import { NextRequest, NextResponse } from 'next/server'
import { getMpPayment } from '@/lib/mercadopago'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))

  // MP sends different notification types
  const topic     = body.type ?? body.topic
  const paymentId = body.data?.id ?? body.id

  if (topic !== 'payment' || !paymentId) {
    return NextResponse.json({ ok: true })
  }

  let payment
  try {
    payment = await getMpPayment().get({ id: paymentId })
  } catch {
    return NextResponse.json({ error: 'Cannot fetch payment' }, { status: 400 })
  }

  if (payment.status !== 'approved') return NextResponse.json({ ok: true })

  const meta   = (payment.metadata ?? {}) as Record<string, string>
  const userId = meta.user_id
  const date   = meta.date
  const notes  = meta.notes || null

  if (!userId || !date) return NextResponse.json({ ok: true })

  const supabase = adminClient()

  const { data: payRow, error: payErr } = await supabase
    .from('payments')
    .insert({
      user_id:             userId,
      provider:            'mercadopago',
      provider_payment_id: String(paymentId),
      amount:              payment.transaction_amount ?? 0,
      currency:            'ARS',
      status:              'completed',
      type:                'consultation',
    })
    .select('id')
    .single()

  if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

  await supabase.from('consultations').insert({
    user_id:          userId,
    date,
    duration_minutes: 60,
    status:           'confirmed',
    notes,
    payment_id:       payRow.id,
  })

  return NextResponse.json({ ok: true })
}
