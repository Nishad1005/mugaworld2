import Image from "next/image";

const cases = [
  {
    title: "Assam Heritage Rebrand",
    description: "A modern identity woven with cultural depth.",
    image: "/images/case1.jpg",
    align: "left"
  },
  {
    title: "Brand Narrative System",
    description: "Messaging + voice + identity behaviour.",
    image: "/images/case2.jpg",
    align: "right"
  },
  {
    title: "Cultural Campaign Design",
    description: "Strategic storytelling through visual language.",
    image: "/images/case3.jpg",
    align: "left"
  }
];

export default function CaseSection() {
  return (
    <section className="px-6 sm:px-12 md:px-20 py-32 md:py-52 space-y-32 md:space-y-40">
      {cases.map((caseItem, index) => (
        <div
          key={index}
          className={`reveal flex gap-8 md:gap-10 items-center flex-col ${
            caseItem.align === "right" ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <div className="w-full md:w-1/2 relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--gold)] to-transparent opacity-90">
            <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl md:text-8xl font-bold opacity-10">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <h3
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-tight font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {caseItem.title}
            </h3>
            <p className="text-lg sm:text-xl md:text-[20px] text-[var(--sub)]">
              {caseItem.description}
            </p>
            <a className="inline-flex items-center gap-2 text-[var(--gold)] underline hover:scale-105 transition-all duration-300 cursor-pointer text-base sm:text-lg font-medium">
              View Case
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
