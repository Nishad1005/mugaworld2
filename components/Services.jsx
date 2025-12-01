const services = [
  "Brand Identity + Strategy",
  "UI/UX + Web Systems",
  "Packaging + Print",
  "Design Consulting",
  "Creative Campaigns"
];

export default function Services() {
  return (
    <section className="py-24 md:py-48 px-6 sm:px-12 md:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
        {services.map((service, index) => (
          <div
            key={service}
            className="reveal border-2 border-[var(--gold)] rounded-xl p-8 md:p-12 text-center text-lg sm:text-xl md:text-[22px] font-semibold hover:scale-[1.04] transition-all duration-500 hover:bg-[var(--gold)] hover:bg-opacity-10 cursor-pointer group"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <span className="group-hover:text-[var(--gold)] transition-colors duration-300">
              {service}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
