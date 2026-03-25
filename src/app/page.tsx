import Link from 'next/link'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import FaqAccordion from '@/components/ui/faq-accordion'

// ─── Data ────────────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Educación',
    description:
      'Guías, meditaciones y recursos prácticos para cada etapa del proceso. Desde cómo empezar hasta cómo integrar lo que vivís.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Seguimiento',
    description:
      'Registrá cómo te sentís cada día: estado de ánimo, energía, sueño, foco y calma. Descubrí patrones que no podrías ver de otra manera.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Comunidad',
    description:
      'Conectate con personas que comparten experiencias similares. Un espacio de confianza, con privacidad, sin juzgar y sin ruido.',
  },
]

const reviews = [
  {
    nickname: 'sol.verde',
    rating: 5,
    title: 'Cambió mi relación con la ansiedad',
    body: 'Llevaba años con ansiedad crónica. Después de tres meses con el protocolo y usando el seguimiento de Terra, pude ver con datos concretos cómo mi estado de ánimo fue estabilizándose semana a semana.',
    weeks: 12,
  },
  {
    nickname: 'raíz.quieta',
    rating: 5,
    title: 'Por fin un espacio que lo toma en serio',
    body: 'No hay muchos lugares donde hablar de esto sin sentirse juzgado. Terra tiene una comunidad que realmente escucha, y los recursos me ayudaron a entender qué estaba pasando en mi proceso.',
    weeks: 8,
  },
  {
    nickname: 'madera.fina',
    rating: 5,
    title: 'El registro diario hace toda la diferencia',
    body: 'Pensé que era una tontería anotar cómo dormí o cuánta energía tenía. Después de un mes de datos, entendí patrones que nunca habría notado. Ahora ajusto mi rutina con mucha más claridad.',
    weeks: 16,
  },
]

const faqs = [
  {
    question: '¿Qué es el microdosing?',
    answer:
      'El microdosing consiste en consumir dosis muy pequeñas de sustancias como psilocibina (entre el 5% y el 10% de una dosis perceptible), con el objetivo de mejorar el bienestar, la claridad mental y el equilibrio emocional sin producir efectos psicodélicos. La práctica se realiza siguiendo protocolos estructurados, con pausas y seguimiento.',
  },
  {
    question: '¿Necesito experiencia previa para usar Terra?',
    answer:
      'No. Terra está diseñado para acompañarte desde el principio. Tenemos recursos para quienes recién están aprendiendo qué es el microdosing, así como herramientas para personas que ya tienen experiencia y quieren profundizar o hacerlo con más estructura.',
  },
  {
    question: '¿Mis datos son privados?',
    answer:
      'Sí. Tu privacidad es una prioridad. Tus registros de seguimiento son completamente privados y solo vos podés verlos. En la comunidad podés participar con un apodo de tu elección, sin revelar tu nombre real. Nunca compartimos tu información personal con terceros.',
  },
  {
    question: '¿Cómo funciona el seguimiento diario?',
    answer:
      'Cada día podés hacer un check-in rápido de 2 minutos donde registrás tu estado de ánimo, nivel de energía, calidad del sueño, foco y calma, en una escala simple del 1 al 5. Con el tiempo, estos datos generan un historial visual que te permite identificar qué días y qué rutinas te funcionan mejor.',
  },
]

// ─── Sections ────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#8B5E3C]' : 'text-[#E4D9CC]'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#FAF7F2]">
          {/* Subtle decorative circle */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#F0E9DF] opacity-60 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#F5EDE3] opacity-40 pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-[#8B5E3C] mb-6 font-medium">
                Microdosing con intención
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[#2A1F14] leading-tight mb-6">
                Tu camino guiado,{' '}
                <span className="italic text-[#8B5E3C]">a tu ritmo</span>
              </h1>
              <p className="text-lg md:text-xl text-[#7A6B58] leading-relaxed mb-10 max-w-xl">
                Educación práctica, seguimiento personal y una comunidad que entiende lo que estás viviendo. Todo en un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/registro"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#2A1F14] text-white text-sm font-medium hover:bg-[#8B5E3C] transition-colors"
                >
                  Comenzar mi camino
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="#faq"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-[#E4D9CC] text-[#7A6B58] text-sm font-medium hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-colors"
                >
                  ¿Qué es el microdosing?
                </Link>
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-20 flex flex-wrap gap-x-12 gap-y-6">
              {[
                { value: '+800', label: 'personas acompañadas' },
                { value: '3 pilares', label: 'educación, seguimiento, comunidad' },
                { value: '100%', label: 'privado y seguro' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl font-semibold text-[#2A1F14]">{stat.value}</p>
                  <p className="text-sm text-[#A89880] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-xl mb-14">
              <p className="text-xs uppercase tracking-widest text-[#8B5E3C] mb-3 font-medium">
                La plataforma
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#2A1F14] leading-snug">
                Tres pilares que se sostienen entre sí
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-[#FAF7F2] rounded-2xl p-8 flex flex-col gap-5 hover:shadow-sm transition-shadow"
                >
                  <span className="w-11 h-11 rounded-xl bg-[#F5EDE3] flex items-center justify-center text-[#8B5E3C]">
                    {pillar.icon}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#2A1F14] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#7A6B58]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="bg-[#FAF7F2] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-widest text-[#8B5E3C] mb-3 font-medium">
                  Experiencias reales
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#2A1F14] leading-snug">
                  Lo que dicen quienes ya lo vivieron
                </h2>
              </div>
              <Link
                href="/experiencias"
                className="shrink-0 text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4"
              >
                Ver todas las experiencias →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.nickname}
                  className="bg-white rounded-2xl p-8 flex flex-col gap-5 border border-[#E4D9CC]"
                >
                  <StarRating rating={review.rating} />
                  <div className="flex-1">
                    <h4 className="font-serif text-lg font-semibold text-[#2A1F14] mb-3">
                      "{review.title}"
                    </h4>
                    <p className="text-sm leading-relaxed text-[#7A6B58]">
                      {review.body}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F0E9DF]">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#F5EDE3] flex items-center justify-center text-xs font-medium text-[#8B5E3C]">
                        {review.nickname[0].toUpperCase()}
                      </span>
                      <span className="text-xs text-[#A89880]">@{review.nickname}</span>
                    </div>
                    <span className="text-xs text-[#A89880]">{review.weeks} semanas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA mid-page ── */}
        <section className="bg-[#2A1F14] py-20">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#FAF7F2] leading-snug mb-3">
                Empezá con una base sólida
              </h2>
              <p className="text-[#A89880] text-base leading-relaxed">
                Accedé a guías, recursos y una comunidad que te acompaña en cada etapa del proceso.
              </p>
            </div>
            <Link
              href="/registro"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#8B5E3C] text-white text-sm font-medium hover:bg-[#7A5032] transition-colors"
            >
              Crear mi cuenta gratuita
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8B5E3C] mb-3 font-medium">
                  Preguntas frecuentes
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#2A1F14] leading-snug mb-6">
                  Antes de empezar, probablemente te preguntés
                </h2>
                <p className="text-sm leading-relaxed text-[#7A6B58] mb-8">
                  Reunimos las preguntas más comunes de personas que están considerando el microdosing por primera vez o que quieren hacerlo con más estructura.
                </p>
                <Link
                  href="#faq"
                  className="text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4"
                >
                  Ver todas las preguntas →
                </Link>
              </div>
              <div>
                <FaqAccordion items={faqs} />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
