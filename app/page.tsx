"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero.jsx";
import BrandStatement from "@/components/BrandStatement.jsx";
import Services from "@/components/Services.jsx";
import CaseSection from "@/components/CaseSection.jsx";
import CultureParallax from "@/components/CultureParallax.jsx";
import CTA from "@/components/CTA.jsx";
import ThemeToggle from "@/components/ThemeToggle.jsx";
import { initAnimations } from "@/lib/animations.js";

export default function Page() {
  useEffect(() => {
    initAnimations();
  }, []);

  return (
    <>
      <ThemeToggle />
      <main className="overflow-hidden">
        <Hero />
        <BrandStatement />
        <Services />
        <CaseSection />
        <CultureParallax />
        <CTA />
      </main>
    </>
  );
}
