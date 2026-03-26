import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <span className="w-7 h-7 rounded-full bg-[#8B5E3C] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FAF7F2]" />
          </span>
          <span className="text-xl font-serif font-semibold text-[#2A1F14] tracking-wide group-hover:text-[#8B5E3C] transition-colors">
            Terra
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E4D9CC] p-8 shadow-sm">
          {children}
        </div>

      </div>
    </div>
  )
}
