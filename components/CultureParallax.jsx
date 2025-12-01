const images = [
  { src: "/images/loom.jpg", title: "Sualkuchi Loom Work", speed: 0.15 },
  { src: "/images/mask.jpg", title: "Majuli Mask Art", speed: 0.12 },
  { src: "/images/river.jpg", title: "Brahmaputra Dusk", speed: 0.1 }
];

export default function CultureParallax() {
  return (
    <section className="px-6 sm:px-12 md:px-20 py-32 md:py-52">
      <h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center mb-16 md:mb-20 reveal"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Rooted in Culture
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
        {images.map((image, index) => (
          <div
            key={index}
            data-parallax={image.speed}
            className="reveal relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-xl overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] via-transparent to-[#3A614A] opacity-40 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p
                className="text-xl sm:text-2xl md:text-3xl font-light italic text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {image.title}
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-5 transition-opacity duration-500">
              <span className="text-8xl md:text-9xl font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
