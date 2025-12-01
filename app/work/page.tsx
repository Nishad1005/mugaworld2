'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const caseStudies = [
  {
    title: 'Heritage Weaves',
    category: 'Brand Identity',
    description: 'Reimagining Assamese textiles through contemporary visual language',
    fullDescription: 'A comprehensive brand identity project that celebrates the rich textile heritage of Assam while bringing it into the modern era. We worked closely with local artisans to develop a visual system that honors traditional weaving techniques while appealing to contemporary audiences.',
    gradient: 'from-[#F8EDD3] via-[#D9B77C]/30 to-[#3A614A]/20',
    year: '2024',
    client: 'Heritage Textiles Co.',
    services: ['Brand Strategy', 'Visual Identity', 'Packaging Design', 'Digital Presence']
  },
  {
    title: 'Tea Tales',
    category: 'Digital Experience',
    description: 'An immersive journey through Assam\'s tea heritage',
    fullDescription: 'An interactive digital experience that takes users on a journey through the history, culture, and craftsmanship of Assamese tea. The platform combines storytelling, stunning visuals, and seamless user experience to create an unforgettable digital journey.',
    gradient: 'from-[#3A614A]/30 via-[#D9B77C]/20 to-[#F8EDD3]',
    year: '2024',
    client: 'Assam Tea Board',
    services: ['UX/UI Design', 'Web Development', 'Content Strategy', 'Motion Design']
  },
  {
    title: 'Majuli Makers',
    category: 'Cultural Campaign',
    description: 'Amplifying indigenous artistry through strategic storytelling',
    fullDescription: 'A cultural campaign designed to showcase the incredible artisans of Majuli Island. Through documentary-style storytelling and strategic digital marketing, we helped connect these talented makers with global audiences while preserving their authentic cultural voice.',
    gradient: 'from-[#D9B77C]/40 via-[#F8EDD3] to-[#D9B77C]/20',
    year: '2023',
    client: 'Majuli Cultural Foundation',
    services: ['Campaign Strategy', 'Content Creation', 'Social Media', 'Photography']
  }
];

export default function WorkPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-black">
      <section className="relative py-32 bg-[#F8EDD3] dark:bg-[#1D1D1D]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1D1D1D] dark:text-[#FFFEF2] hover:text-[#D9B77C] dark:hover:text-[#D9B77C] mb-12 cinematic-transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 cinematic-transition" />
            <span>Back to Home</span>
          </Link>

          <div className={`mb-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h1 className="text-6xl md:text-8xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] mb-6">
              Our Work
            </h1>
            <div className="w-24 h-1 bg-[#D9B77C] mb-8"></div>
            <p className="text-xl md:text-2xl text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 max-w-3xl">
              Culture-led design solutions that connect heritage with contemporary vision.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-white dark:bg-black">
        {caseStudies.map((project, idx) => (
          <CaseStudyCard key={idx} project={project} index={idx} />
        ))}
      </section>
    </div>
  );
}

function CaseStudyCard({ project, index }: { project: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="min-h-screen flex items-center py-24 border-b border-[#E6E6E6] dark:border-[#2A2A2A] last:border-b-0"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`relative h-[500px] rounded-3xl bg-gradient-to-br ${project.gradient} overflow-hidden cinematic-transition ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-[#1D1D1D]/5 dark:text-white/5">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className={`cinematic-transition ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-[#D9B77C]/20 text-[#D9B77C] text-sm font-medium">
              {project.category}
            </div>

            <h2 className="text-5xl md:text-7xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] mb-6 leading-tight">
              {project.title}
            </h2>

            <p className="text-xl text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 mb-8 leading-relaxed">
              {project.fullDescription}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 p-6 rounded-2xl bg-[#F8EDD3]/30 dark:bg-[#D9B77C]/5 border border-[#E6E6E6] dark:border-[#2A2A2A]">
              <div>
                <div className="text-sm text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60 mb-1">Year</div>
                <div className="text-lg font-medium text-[#1D1D1D] dark:text-[#FFFEF2]">{project.year}</div>
              </div>
              <div>
                <div className="text-sm text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60 mb-1">Client</div>
                <div className="text-lg font-medium text-[#1D1D1D] dark:text-[#FFFEF2]">{project.client}</div>
              </div>
            </div>

            <div className="mb-10">
              <div className="text-sm text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60 mb-3">Services</div>
              <div className="flex flex-wrap gap-2">
                {project.services.map((service: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-white dark:bg-[#1D1D1D] border border-[#E6E6E6] dark:border-[#2A2A2A] text-sm text-[#1D1D1D] dark:text-[#FFFEF2]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#1D1D1D] dark:bg-[#FFFEF2] text-white dark:text-[#1D1D1D] hover:bg-[#D9B77C] dark:hover:bg-[#D9B77C] font-medium cinematic-transition hover:scale-105 group"
            >
              <span>Start a Project Like This</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 cinematic-transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
