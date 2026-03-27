import { getResend, FROM_EMAIL } from './index'

export async function sendWelcomeEmail(to: string) {
  try {
    await getResend().emails.send({
      from:    FROM_EMAIL,
      to,
      subject: 'Bienvenido/a a Terra 🌱',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2A1F14;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Tu espacio en Terra está listo</h1>
          <p style="font-size: 15px; line-height: 1.7; color: #7A6B58; margin-bottom: 20px;">
            Gracias por unirte. Terra es tu espacio para explorar el microdosing con intención, seguimiento y comunidad.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #7A6B58; margin-bottom: 32px;">
            Te recomendamos empezar por explorar los recursos y hacer tu primer registro diario.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/tracking"
             style="display: inline-block; background: #2A1F14; color: #FAF7F2; text-decoration: none;
                    padding: 12px 28px; border-radius: 100px; font-size: 14px; font-weight: 500;">
            Empezar ahora →
          </a>
          <p style="font-size: 12px; color: #A89880; margin-top: 40px;">Terra · Hecho con cuidado.</p>
        </div>
      `,
    })
  } catch {
    // Non-blocking — email failure should not break registration
  }
}

export async function sendConsultationConfirmedEmail(to: string, date: Date) {
  const dateStr = date.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

  try {
    await getResend().emails.send({
      from:    FROM_EMAIL,
      to,
      subject: 'Consulta confirmada en Terra',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2A1F14;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">Tu consulta está confirmada</h1>
          <p style="font-size: 15px; line-height: 1.7; color: #7A6B58; margin-bottom: 8px;">
            Te esperamos el <strong>${dateStr}</strong> a las <strong>${timeStr}</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #7A6B58; margin-bottom: 32px;">
            Duracion: 60 minutos. Te contactaremos con el enlace de la sesión antes de la fecha.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/consultations"
             style="display: inline-block; background: #2A1F14; color: #FAF7F2; text-decoration: none;
                    padding: 12px 28px; border-radius: 100px; font-size: 14px; font-weight: 500;">
            Ver mis consultas →
          </a>
          <p style="font-size: 12px; color: #A89880; margin-top: 40px;">Terra · Hecho con cuidado.</p>
        </div>
      `,
    })
  } catch {
    // Non-blocking
  }
}
