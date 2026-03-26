export default function TrackingPage() {
  return (
    <div className="p-8 max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-[#8B5E3C] mb-3 font-medium">
        Seguimiento
      </p>
      <h1 className="font-serif text-3xl font-semibold text-[#2A1F14] mb-2">
        Tu registro diario
      </h1>
      <p className="text-[#7A6B58] text-base leading-relaxed mb-8">
        Pronto vas a poder registrar tu estado de ánimo, energía, sueño, foco y calma cada día.
      </p>

      <div className="rounded-2xl border border-[#E4D9CC] bg-white p-10 flex flex-col items-center text-center gap-4">
        <span className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-medium text-[#2A1F14] mb-1">
            El formulario de seguimiento está en camino
          </p>
          <p className="text-sm text-[#A89880]">
            Esta sección se habilitará en la próxima actualización.
          </p>
        </div>
      </div>
    </div>
  )
}
