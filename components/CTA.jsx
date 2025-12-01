export default function CTA() {
  return (
    <section className="text-center py-32 md:py-52 px-6">
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-[58px] leading-tight font-light max-w-4xl mx-auto mb-12"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Let's shape something unforgettable.
      </h2>

      <button className="reveal px-10 sm:px-12 py-4 sm:py-5 bg-[var(--gold)] text-[var(--text)] rounded-full font-semibold text-base sm:text-lg hover:scale-[1.05] transition-all duration-300 shadow-lg relative group overflow-hidden">
        <span className="relative z-10">Work With Us</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
      </button>

      <footer className="mt-32 pt-12 border-t border-[var(--gold)] border-opacity-20">
        <p className="text-sm sm:text-base text-[var(--sub)] font-medium">
          © 2024 MUGA WORLD. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
