import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendConsultationConfirmedEmail } from '@/lib/resend/emails'

// Use service role client for webhook — bypasses RLS
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object
    const meta     = session.metadata ?? {}
    const userId   = meta.user_id
    const date     = meta.date
    const notes    = meta.notes || null

    if (!userId || !date) return NextResponse.json({ ok: true })

    const supabase = adminClient()

    // Insert payment
    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .insert({
        user_id:             userId,
        provider:            'stripe',
        provider_payment_id: session.payment_intent as string,
        amount:              (session.amount_total ?? 0) / 100,
        currency:            session.currency?.toUpperCase() ?? 'USD',
        status:              'completed',
        type:                'consultation',
      })
      .select('id')
      .single()

    if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

    // Insert consultation
    await supabase.from('consultations').insert({
      user_id:          userId,
      date,
      duration_minutes: 60,
      status:           'confirmed',
      notes,
      payment_id:       payment.id,
    })

    // Send confirmation email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (profile) {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId)
      if (authUser.user?.email) {
        await sendConsultationConfirmedEmail(authUser.user.email, new Date(date))
      }
    }
  }

  return NextResponse.json({ ok: true })
}
