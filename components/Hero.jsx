export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 grain-texture pointer-events-none"></div>

      <h1 className="h1-title reveal font-semibold text-[var(--text)] leading-none mb-0">
        MUGA WORLD
      </h1>

      <p className="mt-6 reveal text-lg sm:text-xl md:text-[22px] text-[var(--sub)] font-medium tracking-wide">
        Design · Culture · Strategy
      </p>

      <button className="mt-10 reveal px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg bg-[var(--gold)] text-[var(--text)] hover:scale-[1.04] transition-all duration-300 shadow-lg">
        Explore Our Capabilities
      </button>

      <div className="absolute bottom-16 flex flex-col items-center gap-2 opacity-60 animate-bounce">
        <span className="text-sm font-medium text-[var(--text)]">Scroll</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
