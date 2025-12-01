export function revealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.2 }
  );
  els.forEach((el) => obs.observe(el));
}

export function parallax() {
  const handleScroll = () => {
    document.querySelectorAll("[data-parallax]").forEach((el, i) => {
      const speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      el.style.transform = `translateY(${window.scrollY * speed * (i + 1)}px)`;
    });
  };

  if (typeof window !== 'undefined') {
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.removeEventListener("scroll", handleScroll);
  }
}

export function initAnimations() {
  if (typeof window !== 'undefined') {
    revealOnScroll();
    parallax();
  }
}
