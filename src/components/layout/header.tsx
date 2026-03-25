'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Preguntas frecuentes', href: '#faq' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#E4D9CC]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-full bg-[#8B5E3C] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FAF7F2]" />
          </span>
          <span
            className="text-xl font-serif font-semibold text-[#2A1F14] tracking-wide group-hover:text-[#8B5E3C] transition-colors"
          >
            Terra
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#7A6B58] hover:text-[#2A1F14] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[#2A1F14] px-4 py-2 rounded-full border border-[#E4D9CC] hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="text-sm font-medium text-white bg-[#2A1F14] px-4 py-2 rounded-full hover:bg-[#8B5E3C] transition-colors"
          >
            Comenzar
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#7A6B58]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E4D9CC] bg-[#FAF7F2] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#7A6B58] hover:text-[#2A1F14] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E4D9CC]">
            <Link
              href="/login"
              className="text-sm font-medium text-center text-[#2A1F14] px-4 py-2 rounded-full border border-[#E4D9CC]"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="text-sm font-medium text-center text-white bg-[#2A1F14] px-4 py-2 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Comenzar
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
