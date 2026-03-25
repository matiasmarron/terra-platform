import Link from 'next/link'

const links = {
  plataforma: [
    { label: 'Recursos', href: '/recursos' },
    { label: 'Seguimiento', href: '/seguimiento' },
    { label: 'Comunidad', href: '/comunidad' },
    { label: 'Consultas', href: '/consultas' },
  ],
  soporte: [
    { label: 'Preguntas frecuentes', href: '#faq' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Términos', href: '/terminos' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#2A1F14] text-[#C4B09A]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FAF7F2]" />
              </span>
              <span className="text-xl font-serif font-semibold text-[#FAF7F2] tracking-wide">
                Terra
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#A89880] max-w-xs">
              Un espacio para explorar el microdosing con intención, acompañamiento y comunidad.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#7A6B58] mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2">
              {links.plataforma.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A89880] hover:text-[#FAF7F2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#7A6B58] mb-4">
              Soporte
            </h4>
            <ul className="space-y-2">
              {links.soporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A89880] hover:text-[#FAF7F2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3D2E1E] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#7A6B58]">
            © {new Date().getFullYear()} Terra. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#7A6B58]">
            Hecho con cuidado.
          </p>
        </div>
      </div>
    </footer>
  )
}
