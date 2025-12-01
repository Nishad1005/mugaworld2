export default function BrandStatement() {
  const statements = [
    { text: "We build identities.", highlight: false },
    { text: "We shape visual cultures.", highlight: true },
    { text: "We design systems that travel the world.", highlight: false }
  ];

  return (
    <section className="text-center max-w-3xl mx-auto py-32 md:py-48 px-6 space-y-8 md:space-y-10">
      {statements.map((statement, index) => (
        <h2
          key={index}
          className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-light leading-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            transitionDelay: `${index * 0.15}s`
          }}
        >
          {statement.highlight ? (
            <>
              We shape{" "}
              <span className="relative inline-block">
                visual cultures
                <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[var(--gold)]"></span>
              </span>
              .
            </>
          ) : (
            statement.text
          )}
        </h2>
      ))}
    </section>
  );
}
